/// <reference types="@webgpu/types" />

export default class Renderer {
    canvas: HTMLCanvasElement;

    // API Data Structures
    adapter: GPUAdapter;
    device: GPUDevice;
    queue: GPUQueue;

    // Frame Backings
    context: GPUCanvasContext;

    // Compute vars
    pipeline: GPUComputePipeline;
    bindGroup: GPUBindGroup;
    outputBuffer: GPUBuffer;
    numGroups: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    async init() {
        if (await this.initializeAPI()) {
            await this.onResize();
        }
    }

    async initializeAPI(): Promise<boolean> {
        try {
            const entry: GPU = navigator.gpu;
            if (!entry) {
                console.log("WebGPU may not be supported in your browser");
                return false;
            }

            this.adapter = await entry.requestAdapter();
            this.device = await this.adapter.requestDevice();
            this.queue = this.device.queue;

            const wgSize = 256;
            const width = this.canvas.width;
            const height = this.canvas.height;
            this.numGroups = (width * height) / wgSize;

            this.pipeline = this.device.createComputePipeline({
                layout: 'auto',
                compute: {
                    module: this.device.createShaderModule({ code: this.computeShader(wgSize) }),
                    entryPoint: 'main'
                }
            });

            // Allocate a buffer to hold the output
            const bufferNumElements = width * height;
            this.outputBuffer = this.device.createBuffer({
                size: bufferNumElements * Uint32Array.BYTES_PER_ELEMENT,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
                // mappedAtCreation: true,
            });
            // const data = new Uint32Array(this.outputBuffer.getMappedRange());
            // for (let i = 0; i < bufferNumElements; ++i) {
            //     data[i] = 0xFF0000FF;
            // }
            // this.outputBuffer.unmap();


            this.bindGroup = this.device.createBindGroup({
                layout: this.pipeline.getBindGroupLayout(0),
                entries: [{ binding: 0, resource: { buffer: this.outputBuffer } }],
            });

        } catch (e) {
            console.error(e);
            return false;
        }

        return true;
    }

    async onResize() {
        if (!this.context) {
            this.context = this.canvas.getContext('webgpu');
            const canvasConfig: GPUCanvasConfiguration = {
                device: this.device,
                format: 'bgra8unorm',
                // format: 'rgba8unorm',
                usage:
                    GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST
            };
            this.context.configure(canvasConfig);
        }
    }

    // Called once per frame
    render(dt: number) {
        let commandBuffers = Array<GPUCommandBuffer>();

        // Run the compute shader
        {
            const computeEncoder = this.device.createCommandEncoder();

            const pass = computeEncoder.beginComputePass();
            pass.setPipeline(this.pipeline);
            pass.setBindGroup(0, this.bindGroup);
            pass.dispatchWorkgroups(this.numGroups);
            pass.end();

            commandBuffers.push(computeEncoder.finish());
        }

        {
            const renderEncoder = this.device.createCommandEncoder();

            const colorTexture = this.context.getCurrentTexture();
            const imageCopyBuffer: GPUImageCopyBuffer = {
                buffer: this.outputBuffer,
                rowsPerImage: this.canvas.height,
                bytesPerRow: this.canvas.width * 4,
            };
            const imageCopyTexture: GPUImageCopyTexture = {
                texture: colorTexture
            };
            const extent: GPUExtent3D = {
                width: this.canvas.width,
                height: this.canvas.height
            };
            renderEncoder.copyBufferToTexture(imageCopyBuffer, imageCopyTexture, extent);

            commandBuffers.push(renderEncoder.finish());
        }

        this.queue.submit(commandBuffers);
    };

    computeShader(wgSize: number): string {
        const width = this.canvas.width;
        const height = this.canvas.height;

        const wgsl = `
///////////////////////////////////////////////////////////////////////////////
// Ray

struct ray {
    orig : vec3<f32>,
    dir : vec3<f32>,
}

fn ray_at(r: ray, t: f32) -> vec3<f32> {
    return r.orig + t * r.dir;
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Color

alias color = vec3<f32>;
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
// Main

@group(0) @binding(0)
var<storage, read_write> output : array<u32>;


fn ray_color(r : ray) -> color {
    let unit_direction = normalize(r.dir);
    let t = 0.5 * (unit_direction.y + 1.0);
    return (1.0 - t) * color(1.0, 1.0, 1.0) + t * color(0.5, 0.7, 1.0);
}

fn color_to_u32(c : color) -> u32 {
    let r = u32(c.r * 255.0);
    let g = u32(c.g * 255.0);
    let b = u32(c.b * 255.0);
    let a = 255u;
    
    // bgra8unorm
    return (a << 24) | (r << 16) | (g << 8) | b;
    
    // rgba8unorm
    // return (a << 24) | (b << 16) | (g << 8) | r;
}

@compute @workgroup_size(${wgSize})
fn main(
    @builtin(global_invocation_id) global_invocation_id : vec3<u32>,
    ) {
        // Compute current x,y
        let offset = global_invocation_id.x;
        let x = f32(offset % ${width});
        let y = ${height} - f32(offset / ${width}); // Flip Y so Y+ is up

        // Image
        const aspect_ratio = ${width} / ${height};
        const image_width = ${width};
        const image_height = ${height};
        
        // Camera
        const viewport_height = 2.0;
        const viewport_width = aspect_ratio * viewport_height;
        const focal_length = 1.0;

        const origin = vec3(0.0, 0.0, 0.0);
        const horizontal = vec3(viewport_width, 0.0, 0.0);
        const vertical = vec3(0.0, viewport_height, 0.0);
        const lower_left_corner = origin - horizontal/2 - vertical/2 - vec3(0, 0, focal_length);

        // Render
        let u = x / image_width;
        let v = y / image_height;
        let r = ray(origin, lower_left_corner + u*horizontal + v*vertical - origin);
        let pixel_color = ray_color(r);
        
        // Store color for current pixel
        output[offset] = color_to_u32(pixel_color);
}
///////////////////////////////////////////////////////////////////////////////


        `;

        return wgsl;
    }
}
