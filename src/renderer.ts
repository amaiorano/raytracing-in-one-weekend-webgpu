/// <reference types="@webgpu/types" />

import { vec3, vec4 } from 'gl-matrix'
import { Pane } from 'tweakpane'

function Buf2Hex(buffer: ArrayBuffer): string {
    return [...new Uint8Array(buffer)]
        .map((x, i) => ((i % 4 == 0) ? '\n' : '') + x.toString(16).padStart(2, '0'))
        .join(' ');
};

function Merge(...buffers: ArrayBuffer[]): ArrayBuffer {
    let size = buffers.reduce((p, b) => p + b.byteLength, 0);
    let merged = new Uint8Array(size);
    let offset = 0;
    buffers.forEach((b, i) => {
        merged.set(new Uint8Array(b), offset);
        offset += b.byteLength;
    });
    return merged;
}

function Copy(src: ArrayBuffer, dst: ArrayBuffer, offset?: number) {
    new Uint8Array(dst, offset).set(new Uint8Array(src));
}

class BufferWriter {
    buffer: ArrayBuffer
    constructor(buffer: ArrayBuffer) {
        this.buffer = buffer;
    }

    setU32(offset: number, v: number) {
        new Uint32Array(this.buffer, offset).set([v]);
    }

    setI32(offset: number, v: number) {
        new Int32Array(this.buffer, offset).set([v]);
    }

    setF32(offset: number, v: number) {
        new Float32Array(this.buffer, offset).set([v]);
    }

    setVec3f(offset: number, v: vec3) {
        new Float32Array(this.buffer, offset).set([
            v[0], v[1], v[2]
        ]);
    }

    setVec4f(offset: number, v: vec4) {
        new Float32Array(this.buffer, offset).set([
            v[0], v[1], v[2], v[3]
        ]);
    }
}

class DynamicBuffer {
    buffer: ArrayBuffer
    count = 0

    protected add(in_buffer: ArrayBuffer) {
        if (this.buffer === undefined) {
            this.buffer = in_buffer;
        } else {
            this.buffer = Merge(this.buffer, in_buffer);
        }
        this.count += 1;
    }
}

class Materials extends DynamicBuffer {
    // /*            align(16) size(16) */ struct lambertian_material {
    // /* offset( 0) align(16) size(12) */   albedo : vec3<f32>;
    // /* offset(12) align( 1) size( 4) */   // -- implicit struct size padding --;
    // /*                               */ };

    // /*            align(16) size(16) */ struct metal_material {
    // /* offset( 0) align(16) size(12) */   albedo : vec3<f32>;
    // /* offset(12) align( 4) size( 4) */   fuzz : f32;
    // /*                               */ };

    // /*           align(4) size(4) */ struct dielectric_material {
    // /* offset(0) align(4) size(4) */   ir : f32;
    // /*                            */ };

    // /*            align(16) size(64) */ struct material {
    // /* offset( 0) align( 4) size( 4) */   ty : u32;
    // /* offset( 4) align( 1) size(12) */   // -- implicit field alignment padding --;
    // /* offset(16) align(16) size(16) */   lambertian : lambertian_material;
    // /* offset(32) align(16) size(16) */   metal : metal_material;
    // /* offset(48) align( 4) size( 4) */   dielectric : dielectric_material;
    // /* offset(52) align( 1) size(12) */   // -- implicit struct size padding --;
    // /*                               */ };
    addLambertian(albedo: vec3): number {
        const b = new ArrayBuffer(64);
        const w = new BufferWriter(b);
        // ty
        w.setU32(0, 0); // ty
        w.setVec3f(16 + 0, albedo);
        this.add(b);
        return this.count - 1;
    }

    addMetal(albedo: vec3, fuzz: number): number {
        const b = new ArrayBuffer(64);
        const w = new BufferWriter(b);
        w.setU32(0, 1); // ty
        w.setVec3f(32 + 0, albedo);
        w.setF32(32 + 12, fuzz);
        this.add(b);
        return this.count - 1;
    }

    addDieletric(ir: number): number {
        const b = new ArrayBuffer(64);
        const w = new BufferWriter(b);
        w.setU32(0, 2); // ty
        w.setF32(48 + 0, ir);
        this.add(b);
        return this.count - 1;
    }
}

class HittableList extends DynamicBuffer {
    // /*            align(16) size(32) */ struct sphere {
    // /* offset( 0) align(16) size(12) */   center : vec3<f32>;
    // /* offset(12) align( 4) size( 4) */   radius : f32;
    // /* offset(16) align( 4) size( 4) */   mat : u32;
    // /* offset(20) align( 1) size(12) */   // -- implicit struct size padding --;
    // /*                               */ };

    // /*             align(16) size(???) */ struct hittable_list {
    // /* offset(  0) align(16) size(???) */   spheres : array<sphere, ?>;
    // /*                                 */ };
    addSphere(center: vec3, radius: number, mat: number) {
        const b = new ArrayBuffer(32);
        const w = new BufferWriter(b);
        w.setVec3f(0, center);
        w.setF32(12, radius);
        w.setU32(16, mat);
        this.add(b);
    }
}

class CameraCreateParams {
    // /*            align(16) size(64) */ struct camera_create_params {
    // /* offset( 0) align(16) size(12) */   lookfrom : vec3<f32>;
    // /* offset(12) align( 1) size( 4) */   // -- implicit field alignment padding --;
    // /* offset(16) align(16) size(12) */   lookat : vec3<f32>;
    // /* offset(28) align( 1) size( 4) */   // -- implicit field alignment padding --;
    // /* offset(32) align(16) size(12) */   vup : vec3<f32>;
    // /* offset(44) align( 4) size( 4) */   vfov : f32;
    // /* offset(48) align( 4) size( 4) */   aspect_ratio : f32;
    // /* offset(52) align( 4) size( 4) */   aperture : f32;
    // /* offset(56) align( 4) size( 4) */   focus_dist : f32;
    // /* offset(60) align( 1) size( 4) */   // -- implicit struct size padding --;
    // /*                               */ };
    buffer: ArrayBuffer
    private writer: BufferWriter

    constructor() {
        this.buffer = new ArrayBuffer(112);
        this.writer = new BufferWriter(this.buffer);
        // Set some useful defaults
        this.lookfrom(vec3.fromValues(0, 0, 0));
        this.lookat(vec3.fromValues(0, 0, -1));
        this.vup(vec3.fromValues(0, 1, 0));
        this.vfov(20.0);
        this.aspect_ratio(16.0 / 9.0);
        this.aperture(0.02);
        this.focus_dist(1.0);
    }

    lookfrom(v: vec3): CameraCreateParams {
        this.writer.setVec3f(0, v);
        return this;
    }
    lookat(v: vec3): CameraCreateParams {
        this.writer.setVec3f(16, v);
        return this;
    }
    vup(v: vec3): CameraCreateParams {
        this.writer.setVec3f(32, v);
        return this;
    }
    vfov(v: number): CameraCreateParams {
        this.writer.setF32(44, v);
        return this;
    }
    aspect_ratio(v: number): CameraCreateParams {
        this.writer.setF32(48, v);
        return this;
    }
    aperture(v: number): CameraCreateParams {
        this.writer.setF32(52, v);
        return this;
    }
    focus_dist(v: number): CameraCreateParams {
        this.writer.setF32(56, v);
        return this;
    }
}

class RaytracerConfig {
    // /*            align(16) size(48) */ struct raytracer_config {
    // /* offset( 0) align( 4) size( 4) */   samples_per_pixel : u32;
    // /* offset( 4) align( 4) size( 4) */   max_depth : u32;
    // /* offset( 8) align( 1) size( 8) */   // -- implicit field alignment padding --;
    // /* offset(16) align(16) size(16) */   rand_seed : vec4<f32>;
    // /* offset(32) align( 4) size( 4) */   weight : f32;
    // /* offset(36) align( 1) size(12) */   // -- implicit struct size padding --;
    // /*                               */ };
    buffer: ArrayBuffer;
    private writer: BufferWriter
    constructor() {
        this.buffer = new ArrayBuffer(112);
        this.writer = new BufferWriter(this.buffer);
        // Set some useful defaults
        this.samples_per_pixel(25);
        this.max_depth(10);
    }

    samples_per_pixel(v: number): RaytracerConfig {
        this.writer.setU32(0, v);
        return this;
    }
    max_depth(v: number): RaytracerConfig {
        this.writer.setU32(4, v);
        return this;
    }
    rand_seed(v: vec4) {
        this.writer.setVec4f(16, v);
        return this;
    }
    weight(v: number) {
        this.writer.setF32(32, v);
        return this;
    }
}

class Dims {
    constructor(width = 0, height = 0) {
        this.width = width;
        this.height = height;
    }
    width: number
    height: number
}

export default class Renderer {
    canvas: HTMLCanvasElement;
    renderDims: Dims;
    pane: Pane;

    // API Data Structures
    adapter: GPUAdapter;
    device: GPUDevice;
    queue: GPUQueue;

    // Frame Backings
    context: GPUCanvasContext;

    // Compute vars
    wgSize: number; // Size of each workgroup
    numGroups: number; // Number of workgroups to dispatch
    pipeline: GPUComputePipeline;
    bindGroup: GPUBindGroup;
    outputBuffer: GPUBuffer;
    materialsBuffer: GPUBuffer;
    hittableListBuffer: GPUBuffer;
    cameraCreateParamsBuffer: GPUBuffer;
    raytracerConfigBuffer: GPUBuffer;
    bindings = {
        output: 0,
        materials: 1,
        hittable_list: 2,
        camera_create_params: 3,
        raytracer_config: 4,
    }

    materials: Materials;
    hittableList: HittableList;
    cameraCreateParams: CameraCreateParams;

    // Config vars
    config = {
        resolutionIndex: 0, // Set to list of [width, height]
        scene: 1,
        samplesPerPixel: 25,
        maxDepth: 10,
    }

    dirty = true;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.renderDims = new Dims(canvas.width, canvas.height);
    }

    async init() {
        if (await this.initializeAPI()) {
            await this.onResize();
        }
    }

    updateScene() {
        this.materials = new Materials();
        this.hittableList = new HittableList();
        this.cameraCreateParams = new CameraCreateParams();

        const scene = this.config.scene;

        if (scene === 11 || scene === 12) {
            this.materials.addLambertian(vec3.fromValues(0.8, 0.8, 0.0));
            this.materials.addLambertian(vec3.fromValues(0.7, 0.3, 0.3));
            if (scene == 11) {
                this.materials.addMetal(vec3.fromValues(0.8, 0.8, 0.8), 0.0);
                this.materials.addMetal(vec3.fromValues(0.8, 0.6, 0.2), 0.0);
            } else {
                this.materials.addMetal(vec3.fromValues(0.8, 0.8, 0.8), 0.3);
                this.materials.addMetal(vec3.fromValues(0.8, 0.6, 0.2), 1.0);
            }

            this.hittableList.addSphere(vec3.fromValues(0.0, -100.5, -1.0), 100.0, 0);
            this.hittableList.addSphere(vec3.fromValues(0.0, 0.0, -1.0), 0.5, 1);
            this.hittableList.addSphere(vec3.fromValues(-1.0, 0.0, -1.0), 0.5, 2);
            this.hittableList.addSphere(vec3.fromValues(1.0, 0.0, -1.0), 0.5, 3);

            const lookfrom = vec3.fromValues(0, 0, 0);
            const lookat = vec3.fromValues(0, 0, -1);
            let delta = vec3.create();
            vec3.sub(delta, lookat, lookfrom);
            const focus_dist = vec3.length(delta);
            this.cameraCreateParams
                .lookfrom(lookfrom)
                .lookat(lookat)
                .vup(vec3.fromValues(0, 1, 0))
                .focus_dist(focus_dist)
                .aperture(0.0)
                .vfov(90.0)
                .aspect_ratio(this.renderDims.width / this.renderDims.height);
        }

        else if (scene === 16 || scene === 18 || scene === 19) {
            this.materials.addLambertian(vec3.fromValues(0.8, 0.8, 0.0));
            this.materials.addLambertian(vec3.fromValues(0.1, 0.2, 0.5));
            this.materials.addDieletric(1.5);
            this.materials.addMetal(vec3.fromValues(0.8, 0.6, 0.2), 0.0);

            this.hittableList.addSphere(vec3.fromValues(0.0, -100.5, -1.0), 100.0, 0);
            this.hittableList.addSphere(vec3.fromValues(0.0, 0.0, -1.0), 0.5, 1);
            this.hittableList.addSphere(vec3.fromValues(-1.0, 0.0, -1.0), 0.5, 2);
            this.hittableList.addSphere(vec3.fromValues(-1.0, 0.0, -1.0), -0.4, 2);
            this.hittableList.addSphere(vec3.fromValues(1.0, 0.0, -1.0), 0.5, 3);

            var lookfrom: vec3;
            var lookat: vec3;
            var vfov: number;
            if (scene === 16) {
                lookfrom = vec3.fromValues(0, 0, 0);
                lookat = vec3.fromValues(0, 0, -1);
                vfov = 90;
            } else if (scene === 18) {
                lookfrom = vec3.fromValues(-2, 2, 1);
                lookat = vec3.fromValues(0, 0, -1);
                vfov = 90;
            } else if (scene === 19) {
                lookfrom = vec3.fromValues(-2, 2, 1);
                lookat = vec3.fromValues(0, 0, -1);
                vfov = 20;
            }

            let delta = vec3.create();
            vec3.sub(delta, lookat, lookfrom);
            const focus_dist = vec3.length(delta);
            this.cameraCreateParams
                .lookfrom(lookfrom)
                .lookat(lookat)
                .vup(vec3.fromValues(0, 1, 0))
                .focus_dist(focus_dist)
                .aperture(0.0)
                .vfov(vfov)
                .aspect_ratio(this.renderDims.width / this.renderDims.height);
        }

        else if (scene === 20) {
            this.materials.addLambertian(vec3.fromValues(0.8, 0.8, 0.0));
            this.materials.addLambertian(vec3.fromValues(0.1, 0.2, 0.5));
            this.materials.addDieletric(1.5);
            this.materials.addMetal(vec3.fromValues(0.8, 0.6, 0.2), 0.0);

            this.hittableList.addSphere(vec3.fromValues(0.0, -100.5, -1.0), 100.0, 0);
            this.hittableList.addSphere(vec3.fromValues(0.0, 0.0, -1.0), 0.5, 1);
            this.hittableList.addSphere(vec3.fromValues(0.0, 0.0, -1.0), 0.5, 1);
            this.hittableList.addSphere(vec3.fromValues(-1.0, 0.0, -1.0), 0.5, 2);
            this.hittableList.addSphere(vec3.fromValues(-1.0, 0.0, -1.0), -0.4, 2);
            this.hittableList.addSphere(vec3.fromValues(1.0, 0.0, -1.0), 0.5, 3);

            const lookfrom = vec3.fromValues(3, 3, 2);
            const lookat = vec3.fromValues(0, 0, -1);
            let delta = vec3.create();
            vec3.sub(delta, lookat, lookfrom);
            const focus_dist = vec3.length(delta);
            this.cameraCreateParams
                .lookfrom(lookfrom)
                .lookat(lookat)
                .vup(vec3.fromValues(0, 1, 0))
                .focus_dist(focus_dist)
                .aperture(2.0)
                .vfov(20.0)
                .aspect_ratio(this.renderDims.width / this.renderDims.height);
        }

        else if (scene === 21) {
            const ground_material = this.materials.addLambertian(vec3.fromValues(0.5, 0.5, 0.5));
            this.hittableList.addSphere(vec3.fromValues(0, -1000, 0), 1000, ground_material);

            const rand = function (min = 0, max = 1) {
                return (Math.random() * (max - min)) + min;
            };

            const randomColor = function (min = 0, max = 1) {
                return vec3.fromValues(rand(min, max), rand(min, max), rand(min, max));
            };

            for (let a = -11; a < 11; a++) {
                for (let b = -11; b < 11; b++) {
                    const choose_mat = Math.random();
                    const center = vec3.fromValues(a + 0.9 * rand(), 0.2, b + 0.9 * rand())

                    let delta = vec3.create();
                    vec3.sub(delta, center, vec3.fromValues(4, 0.2, 0));
                    if (delta.length > 0.9) {
                        if (choose_mat < 0.8) {
                            // diffuse
                            const albedo = vec3.create();
                            vec3.mul(albedo, randomColor(), randomColor());
                            const sphere_material = this.materials.addLambertian(albedo);
                            this.hittableList.addSphere(center, 0.2, sphere_material);
                        } else if (choose_mat < 0.95) {
                            // metal
                            const albedo = randomColor(0.5, 1);
                            const fuzz = rand(0, 0.5);
                            const sphere_material = this.materials.addMetal(albedo, fuzz);
                            this.hittableList.addSphere(center, 0.2, sphere_material);
                        } else {
                            // glass
                            const sphere_material = this.materials.addDieletric(1.5);
                            this.hittableList.addSphere(center, 0.2, sphere_material);
                        }
                    }
                }
            }


            const material1 = this.materials.addDieletric(1.5);
            this.hittableList.addSphere(vec3.fromValues(0, 1, 0), 1.0, material1);

            const material2 = this.materials.addLambertian(vec3.fromValues(0.4, 0.2, 0.1));
            this.hittableList.addSphere(vec3.fromValues(-4, 1, 0), 1.0, material2);

            const material3 = this.materials.addMetal(vec3.fromValues(0.7, 0.6, 0.5), 0.0);
            this.hittableList.addSphere(vec3.fromValues(4, 1, 0), 1.0, material3);

            const lookfrom = vec3.fromValues(13, 2, 3);
            const lookat = vec3.fromValues(0, 0, 0);
            const focus_dist = 10.0;
            this.cameraCreateParams
                .lookfrom(lookfrom)
                .lookat(lookat)
                .vup(vec3.fromValues(0, 1, 0))
                .focus_dist(focus_dist)
                .aperture(0.1)
                .vfov(20.0)
                .aspect_ratio(this.renderDims.width / this.renderDims.height);
        }
    }

    updatePipeline() {
        this.materialsBuffer = this.device.createBuffer({
            size: this.materials.buffer.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true,
        });
        Copy(this.materials.buffer, this.materialsBuffer.getMappedRange());
        this.materialsBuffer.unmap();

        this.hittableListBuffer = this.device.createBuffer({
            size: this.hittableList.buffer.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true,
        });
        Copy(this.hittableList.buffer, this.hittableListBuffer.getMappedRange());
        this.hittableListBuffer.unmap();

        this.cameraCreateParamsBuffer = this.device.createBuffer({
            size: this.cameraCreateParams.buffer.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true,
        });
        Copy(this.cameraCreateParams.buffer, this.cameraCreateParamsBuffer.getMappedRange());
        this.cameraCreateParamsBuffer.unmap();

        this.raytracerConfigBuffer = this.device.createBuffer({
            size: new RaytracerConfig().buffer.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const code = this.computeShader(this.wgSize, this.materials.count, this.hittableList.count);
        // console.log(code);
        this.pipeline = this.device.createComputePipeline({
            layout: 'auto',
            compute: {
                module: this.device.createShaderModule({ code: code }),
                entryPoint: 'main',
            }
        });

        this.bindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                { binding: this.bindings.output, resource: { buffer: this.outputBuffer } },
                { binding: this.bindings.materials, resource: { buffer: this.materialsBuffer } },
                { binding: this.bindings.hittable_list, resource: { buffer: this.hittableListBuffer } },
                { binding: this.bindings.camera_create_params, resource: { buffer: this.cameraCreateParamsBuffer } },
                { binding: this.bindings.raytracer_config, resource: { buffer: this.raytracerConfigBuffer } },
            ],
        });

        this.dirty = true;
    }

    initTweakPane() {
        this.pane = new Pane;

        // Resolution
        let resolutions: number[][] = [];
        let resolutionsNames: any = {}
        const aspectRatio = this.canvas.width / this.canvas.height;
        for (let i = 1; i < 18; ++i) {
            const w = 64 * (i + 2);
            const h = w / aspectRatio;
            resolutionsNames[`${w}x${h}`] = i - 1;
            resolutions.push([w, h]);
        }

        const updateResolution = () => {
            const index = this.config.resolutionIndex;
            this.renderDims.width = resolutions[index][0];
            this.renderDims.height = resolutions[index][1];
        };

        // Set default resolution index
        this.config.resolutionIndex = 7;
        updateResolution();

        let input = this.pane.addInput(this.config, 'resolutionIndex',
            {
                label: 'Resolution', options: resolutionsNames,
            });
        input.on('change', ev => {
            if (ev.last) {
                updateResolution();
                this.updateScene();
                this.updatePipeline(); // TODO: queue.copy
            }
        });

        // Scene
        input = this.pane.addInput(this.config, 'scene',
            {
                label: 'Scene', options: {
                    'Image 11: Shiny metal': 11,
                    'Image 12: Fuzzed metal': 12,
                    'Image 16: A hollow glass sphere': 16,
                    'Image 18: A distant view': 18,
                    'Image 19: Image 19: Zooming in': 19,
                    'Image 20: Spheres with depth-of-field': 20,
                    'Image 21: Final scene': 21,
                }
            });
        input.on('change', ev => {
            if (ev.last) {
                this.updateScene();
                this.updatePipeline(); // TODO: queue.copy
            }
        });

        input = this.pane.addInput(this.config, 'samplesPerPixel',
            { label: 'Samples Per Pixel', min: 1, max: 50, step: 1 });
        input.on('change', ev => {
            if (ev.last) {
                this.updatePipeline(); // TODO: queue.copy
            }
        });

        input = this.pane.addInput(this.config, 'maxDepth',
            { label: 'Max Ray Depth', min: 2, max: 20, step: 1 });
        input.on('change', ev => {
            if (ev.last) {
                this.updatePipeline(); // TODO: queue.copy
            }
        });

        this.config.scene = 11;
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

            const wgSize = 64;
            const width = this.renderDims.width;
            const height = this.renderDims.height;

            this.wgSize = wgSize;
            this.numGroups = (width * height) / wgSize;
            // console.log(`Dispatching ${this.numGroups} workgroups of size ${wgSize}`);

            // Output buffer
            {
                const bufferNumElements = width * height;
                this.outputBuffer = this.device.createBuffer({
                    size: bufferNumElements * Uint32Array.BYTES_PER_ELEMENT,
                    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
                    // mappedAtCreation: true,
                });
                // const data = new Uint32Array(this.outputBuffer.getMappedRange());
                // for (let i = 0; i < bufferNumElements; ++i) {
                //     data[i] = 0xFF0000FF;
                // }
                // this.outputBuffer.unmap();
            }

            this.initTweakPane();
            this.updateScene();
            this.updatePipeline();

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

    frameSamplesPerPixel = {
        max: 1, // Max per frame (constant)
        left: 0, // How many are left to process this frame
        done: 0 // How many processed so far
    }

    // Called once per frame
    render(dt: number) {
        if (dt > 1) {
            console.log(`Long frame detected: ${dt} seconds`);
        }
        if (this.pipeline === undefined) {
            return;
        }

        let commandBuffers = Array<GPUCommandBuffer>();
        const encoder = this.device.createCommandEncoder();

        if (this.dirty) {
            this.frameSamplesPerPixel.left = this.config.samplesPerPixel;
            this.frameSamplesPerPixel.done = 0;
            // Clear output buffer to start accumulating into it
            encoder.clearBuffer(this.outputBuffer);
            this.dirty = false;
        }

        if (this.frameSamplesPerPixel.left > 0) {
            let currSamplesPerPixel = Math.min(this.frameSamplesPerPixel.left, this.frameSamplesPerPixel.max);
            // Compute the amount this frame will contribute to the final pixel as a ratio of how many samples have
            // been processed so far.
            let weight = currSamplesPerPixel / (this.frameSamplesPerPixel.done + currSamplesPerPixel);
            // console.log(`currSamplesPerPixel: ${currSamplesPerPixel}, weight: ${weight}`)

            let config = new RaytracerConfig();
            config.max_depth(this.config.maxDepth);
            config.samples_per_pixel(currSamplesPerPixel);
            config.rand_seed(vec4.fromValues(Math.random(), Math.random(), Math.random(), Math.random()));
            config.weight(weight);

            // TODO: cache set of staging buffers
            const stagingBuffer = this.device.createBuffer({
                size: config.buffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_SRC,
                mappedAtCreation: true,
            });
            Copy(config.buffer, stagingBuffer.getMappedRange());
            encoder.copyBufferToBuffer(stagingBuffer, 0, this.raytracerConfigBuffer, 0, config.buffer.byteLength);
            stagingBuffer.unmap();

            const pass = encoder.beginComputePass();
            pass.setPipeline(this.pipeline);
            pass.setBindGroup(0, this.bindGroup);
            pass.dispatchWorkgroups(this.numGroups);
            pass.end();

            this.frameSamplesPerPixel.left -= currSamplesPerPixel;
            this.frameSamplesPerPixel.done += currSamplesPerPixel;
        }

        // Copy output from compute shader to canvas
        const colorTexture = this.context.getCurrentTexture();
        const imageCopyBuffer: GPUImageCopyBuffer = {
            buffer: this.outputBuffer,
            rowsPerImage: this.renderDims.height,
            bytesPerRow: this.renderDims.width * 4,
        };
        const imageCopyTexture: GPUImageCopyTexture = {
            texture: colorTexture
        };
        const extent: GPUExtent3D = {
            width: this.renderDims.width,
            height: this.renderDims.height
        };
        encoder.copyBufferToTexture(imageCopyBuffer, imageCopyTexture, extent);

        commandBuffers.push(encoder.finish());
        this.queue.submit(commandBuffers);
    };

    computeShader(wgSize: number, numMaterials: number, numSpheres: number): string {
        const width = this.renderDims.width;
        const height = this.renderDims.height;

        const wgsl = `
///////////////////////////////////////////////////////////////////////////////
// Common
alias material_index = u32;
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Ray

struct ray {
    orig : vec3f,
    dir : vec3f,
}

fn ray_at(r: ray, t: f32) -> vec3f {
    return r.orig + t * r.dir;
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Color

alias color = vec3f;
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Utils
fn length_squared(v: vec3f) -> f32 {
    let l = length(v);
    return l * l;
}

fn near_zero(v: vec3f) -> bool {
    const s = 1e-8;
    return length(v) < s;
}

fn random_in_unit_sphere() -> vec3f {
    for (var i = 0; i < 1000; i += 1) {
        let p = random_range_vec3f(-1, 1);
        if (length_squared(p) >= 1) {
            continue;
        }
        return p;
    }
    return vec3f(0,0,0.3);
}

fn random_unit_vector() -> vec3f {
    return normalize(random_in_unit_sphere());
}

fn random_in_hemisphere(normal: vec3f) -> vec3f {
    let in_unit_sphere = random_in_unit_sphere();
    if (dot(in_unit_sphere, normal) > 0.0) { // In the same hemisphere as the normal
        return in_unit_sphere;
    }
    else {
        return -in_unit_sphere;
    }
}

fn random_in_unit_disk() -> vec3f {
    for (var i = 0; i < 1000; i += 1) {
        let p = vec3f(random_range_f32(-1,1), random_range_f32(-1,1), 0);
        if (length_squared(p) >= 1) {
            continue;
        }
        return p;
    }
    return vec3f(0.3,0,0);
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Hittable
struct hit_record {
    p: vec3f,
    normal: vec3f,
    t: f32,
    front_face: bool,
    mat: material_index,
}

fn hit_record_set_face_normal(rec: ptr<function, hit_record>, r: ray, outward_normal: vec3f) {
    (*rec).front_face = dot(r.dir, outward_normal) < 0.0;
    if ((*rec).front_face) {
        (*rec).normal = outward_normal;
    } else {
        (*rec).normal = -outward_normal;
    }
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Material

alias material_type = u32;
const MATERIAL_LAMBERTIAN:  material_type = 0;
const MATERIAL_METAL:       material_type = 1;
const MATERIAL_DIELECTRIC:  material_type = 2;

struct lambertian_material {
    albedo: color,
}

struct metal_material {
    albedo: color,
    fuzz: f32,
}

struct dielectric_material {
    ir: f32 // index of refraction
}

struct material {
    // NOTE: ideally we'd use a discriminated union
    ty: material_type,
    lambertian: lambertian_material,
    metal: metal_material,
    dielectric: dielectric_material
}

const NUM_MATERIALS = ${numMaterials};

@group(0) @binding(${this.bindings.materials})
var<uniform> materials: array<material, NUM_MATERIALS>;


// For the input ray and hit on the input material, returns true if the ray bounces, and if so,
// stores the color contribution (attenuation) from this material and the new bounce (scatter) ray.
fn material_scatter(mat: material_index, r_in: ray, rec: hit_record, attenuation: ptr<function, color>, scattered: ptr<function, ray>) -> bool {
    let m = materials[mat];
    if (m.ty == MATERIAL_LAMBERTIAN) {
        var scatter_direction = rec.normal + random_unit_vector();

        // Catch degenerate scatter direction
        if (near_zero(scatter_direction)) {
            scatter_direction = rec.normal;
        }

        *scattered = ray(rec.p, scatter_direction);
        *attenuation = m.lambertian.albedo;
        return true;

    } else if (m.ty == MATERIAL_METAL) {
        let reflected = reflect(normalize(r_in.dir), rec.normal);
        *scattered = ray(rec.p, reflected + m.metal.fuzz * random_in_unit_sphere());
        *attenuation = m.metal.albedo;
        // Only bounce rays that reflect in the same direction as the incident normal
        return dot((*scattered).dir, rec.normal) > 0;
    
    } else if (m.ty == MATERIAL_DIELECTRIC) {
        *attenuation = color(1, 1, 1);
        let refraction_ratio = select(m.dielectric.ir, 1.0 / m.dielectric.ir, rec.front_face);

        let unit_direction = normalize(r_in.dir);
        let cos_theta = min(dot(-unit_direction, rec.normal), 1.0);
        let sin_theta = sqrt(1.0 - cos_theta * cos_theta);

        let cannot_refract = (refraction_ratio * sin_theta) > 1.0;
        var direction: vec3f;

        if (cannot_refract || reflectance(cos_theta, refraction_ratio) > random_f32()) {
            direction = reflect(unit_direction, rec.normal);
        } else {
            direction = refract(unit_direction, rec.normal, refraction_ratio);
        }

        *scattered = ray(rec.p, direction);
        return true;
    }

    return false;
}

fn reflectance(cosine: f32, ref_idx: f32) -> f32 {
    // Use Schlick's approximation for reflectance.
    var r0 = (1-ref_idx) / (1+ref_idx);
    r0 = r0*r0;
    return r0 + (1-r0)*pow((1 - cosine),5);
}

///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Sphere
struct sphere {
    center: vec3f,
    radius: f32,
    mat: material_index,
}

fn sphere_hit(sphere_index: u32, r: ray, t_min: f32, t_max: f32, rec: ptr<function, hit_record>) -> bool {
    let s = &world.spheres[sphere_index];
    let oc = r.orig - (*s).center;
    let a = length_squared(r.dir);
    let half_b = dot(oc, r.dir);
    let c = length_squared(oc) - (*s).radius*(*s).radius;
    let discriminant = half_b*half_b - a*c;

    if (discriminant < 0) {
        return false;
    }

    let sqrtd = sqrt(discriminant);

    // Find the nearest root that lies in the acceptable range.
    var root = (-half_b - sqrtd) / a;
    if (root < t_min || t_max < root) {
        root = (-half_b + sqrtd) / a;
        if (root < t_min || t_max < root) {
            return false;
        }
    }

    (*rec).t = root;
    (*rec).p = ray_at(r, (*rec).t);
    let outward_normal = ((*rec).p - (*s).center) / (*s).radius;
    hit_record_set_face_normal(rec, r, outward_normal);
    (*rec).mat = (*s).mat;

    return true;
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Hittable List
const NUM_SPHERES = ${numSpheres};
struct hittable_list {
    spheres: array<sphere, NUM_SPHERES>,
}

@group(0) @binding(${this.bindings.hittable_list})
var<uniform> world: hittable_list;

fn hittable_list_hit(r: ray, t_min: f32, t_max: f32, rec: ptr<function, hit_record>) -> bool {
    var temp_rec: hit_record;
    var hit_anything = false;
    var closest_so_far = t_max;

    for (var i = 0u; i < NUM_SPHERES; i += 1u) {
        let s = &world.spheres[i];
        if (sphere_hit(i, r, t_min, closest_so_far, &temp_rec)) {
            hit_anything = true;
            closest_so_far = temp_rec.t;
            *rec = temp_rec;
        }
    }
    return hit_anything;
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Camera

struct camera_create_params {
    lookfrom: vec3f,
    lookat: vec3f,
    vup : vec3f,
    vfov: f32, // vertical field-of-view in degrees
    aspect_ratio: f32,
    aperture : f32,
    focus_dist: f32
}

struct camera {
    origin: vec3f,
    lower_left_corner: vec3f,
    horizontal: vec3f,
    vertical: vec3f,
    u : vec3f,
    v : vec3f,
    w : vec3f,
    lens_radius : f32,
}

fn camera_create(p: camera_create_params) -> camera {
    let theta = radians(p.vfov);
    let h = tan(theta/2);
    let viewport_height = 2.0 * h;
    let viewport_width = p.aspect_ratio * viewport_height;

    // Note: vup, v, and w are all in the same plane
    let w = normalize(p.lookfrom - p.lookat);
    let u = normalize(cross(p.vup, w));
    let v = cross(w, u);

    let origin = p.lookfrom;
    let horizontal = p.focus_dist * viewport_width * u;
    let vertical = p.focus_dist * viewport_height * v;
    let lower_left_corner = origin - horizontal/2 - vertical/2 - p.focus_dist * w;
    let lens_radius = p.aperture / 2;

    return camera(origin, lower_left_corner, horizontal, vertical, u, v, w, lens_radius);
}

fn camera_get_ray(cam: ptr<function, camera>, s: f32, t: f32) -> ray {
    let rd = (*cam).lens_radius * random_in_unit_disk();
    let offset = (*cam).u * rd.x + (*cam).v * rd.y;
    return ray(
        (*cam).origin + offset,
        (*cam).lower_left_corner + s * (*cam).horizontal + t * (*cam).vertical - (*cam).origin - offset
    );
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Random

// Implementation copied from https://webgpu.github.io/webgpu-samples/samples/particles#./particle.wgsl
var<private> rand_seed : vec2<f32>;

fn init_rand(invocation_id : u32, seed : vec4f) {
  rand_seed = seed.xz;
  rand_seed = fract(rand_seed * cos(35.456+f32(invocation_id) * seed.yw));
  rand_seed = fract(rand_seed * cos(41.235+f32(invocation_id) * seed.xw));
}

// Returns random value in [0.0, 1.0)
fn random_f32() -> f32 {
    // return 0.0f;
    rand_seed.x = fract(cos(dot(rand_seed, vec2<f32>(23.14077926, 232.61690225))) * 136.8168);
    rand_seed.y = fract(cos(dot(rand_seed, vec2<f32>(54.47856553, 345.84153136))) * 534.7645);
    return rand_seed.y;
}

fn random_range_f32(min: f32, max: f32) -> f32 {
    return mix(min, max, random_f32());
}

fn random_vec3f() -> vec3f {
    return vec3(random_f32(), random_f32(), random_f32());
}

fn random_range_vec3f(min: f32, max: f32) -> vec3f {
    return vec3(random_range_f32(min, max), random_range_f32(min, max), random_range_f32(min, max));
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////y////////////////////////
// Main

@group(0) @binding(${this.bindings.output})
var<storage, read_write> output : array<u32>;

@group(0) @binding(${this.bindings.camera_create_params})
var<uniform> cp: camera_create_params;

struct raytracer_config {
    samples_per_pixel: u32,
    max_depth: u32,
    rand_seed: vec4f,
    weight: f32,
}
@group(0) @binding(${this.bindings.raytracer_config})
var<uniform> config: raytracer_config;

const infinity = 3.402823466e+38; // NOTE: largest f32 instead of inf
const pi = 3.1415926535897932385;

fn ray_color(in_r: ray, in_max_depth: u32) -> color {
    // Book uses recursion for bouncing rays. We can't recurse in WGSL, so convert algorithm to procedural.
    var r = in_r;
    var c : color = color(1,1,1);
    var rec: hit_record;
    var max_depth = in_max_depth;

    while (true) {
        if (hittable_list_hit(r, 0.001, infinity, &rec)) {
           var attenuation: color;
           var scattered: ray;
            if (material_scatter(rec.mat, r, rec, &attenuation, &scattered)) {
                c *= attenuation;
                r = scattered;
            } else {
                // Material does not contribute, final color is black
                c *= color(0,0,0);
                break;
            }

        } else {
            // If we hit nothing, return a blue sky color (linear blend of ray direction with white and blue)
            let unit_direction = normalize(r.dir);
            let t = 0.5 * (unit_direction.y + 1.0);
            c *= (1.0 - t) * color(1.0, 1.0, 1.0) + t * color(0.5, 0.7, 1.0);
            break;
        }

        // If we've exceeded the ray bounce limit, no more light is gathered.
        max_depth -= 1;
        if (max_depth <= 0) {
            c *= color(0,0,0);
            break;
        }
    }

    return c;
}

fn color_to_u32(c: color) -> u32 {
    let r = u32(c.r * 255.0);
    let g = u32(c.g * 255.0);
    let b = u32(c.b * 255.0);
    let a = 255u;

    // bgra8unorm
    return (a << 24) | (r << 16) | (g << 8) | b;

    // rgba8unorm
    // return (a << 24) | (b << 16) | (g << 8) | r;
}

fn u32_to_color(c: u32) -> color {
    let r = f32((c >> 16) & 0xff) / 255.0;
    let g = f32((c >> 8) & 0xff) / 255.0;
    let b = f32((c >> 0) & 0xff) / 255.0;
    return color(r, g, b);
}

fn write_color(offset: u32, pixel_color: color, samples_per_pixel: u32) {
    var c = pixel_color;
    // Divide the color by the number of samples.
    c /= f32(samples_per_pixel);

    // And gamma-correct for gamma=2.0.
    c = sqrt(c);

    var last = u32_to_color(output[offset]);
    var w = config.weight;
    output[offset] = color_to_u32(last * (1-w) + c * w);
}

@compute @workgroup_size(${wgSize})
fn main(
    @builtin(global_invocation_id) global_invocation_id : vec3<u32>,
    ) {
        init_rand(global_invocation_id.x, config.rand_seed);

        // Camera
        var cam = camera_create(cp);

        // Render

        // Compute current x,y
        let offset = global_invocation_id.x;
        
        // Skip if out of bounds (TODO: only invoke required number of workgroups)
        if (offset >= u32(${width * height})) {
            return;
        }

        let x = f32(offset % ${width});
        let y = ${height} - f32(offset / ${width}); // Flip Y so Y+ is up
        const image_height = ${height};
        const image_width = ${width};
        
        let samples_per_pixel = config.samples_per_pixel;
        let max_depth = config.max_depth;

        var pixel_color = color(0.0, 0.0, 0.0);
        for (var i = 0u; i < samples_per_pixel; i += 1u) {
            let u = (x + random_f32()) / (image_width - 1);
            let v = (y + random_f32()) / (image_height - 1);
            let r = camera_get_ray(&cam, u, v);
            pixel_color += ray_color(r, max_depth);
        }

        // Store color for current pixel
        write_color(offset, pixel_color, samples_per_pixel);
}
///////////////////////////////////////////////////////////////////////////////
        `;

        return wgsl;
    }
}
