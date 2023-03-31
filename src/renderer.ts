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
// Utils
fn length_squared(v: vec3<f32>) -> f32 {
    let l = length(v);
    return l * l;
}

fn near_zero(v: vec3<f32>) -> bool {
    const s = 1e-8;
    return length(v) < s;
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Hittable
struct hit_record {
    p: vec3<f32>,
    normal: vec3<f32>,
    t: f32,
    front_face: bool,
    mat: material,
}

fn hit_record_set_face_normal(rec: ptr<function, hit_record>, r: ray, outward_normal: vec3<f32>) {
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
const MATERIAL_LAMBERTIAN : material_type = 0;
const MATERIAL_METAL : material_type = 1;

struct lambertian_material {
    albedo : color,
}

struct metal_material {
    albedo: color,
}

struct material {
    // NOTE: ideally we'd use a discrimination union
    ty: material_type,
    lambertian: lambertian_material,
    metal: metal_material,
}

fn material_create_lambertian(albedo: color) -> material {
    var m: material;
    m.ty = MATERIAL_LAMBERTIAN;
    m.lambertian = lambertian_material(albedo);
    return m;
}

fn material_create_metal(albedo: color) -> material {
    var m: material;
    m.ty = MATERIAL_METAL;
    m.metal = metal_material(albedo);
    return m;
}

// For the input ray and hit on the input material, returns true if the ray bounces, and if so,
// stores the color contribution (attenuation) from this material and the new bounce (scatter) ray.
fn material_scatter(m: material, r_in: ray, rec: hit_record, attenuation: ptr<function, color>, scattered: ptr<function, ray>) -> bool {
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
        *scattered = ray(rec.p, reflected);
        *attenuation = m.metal.albedo;
        // Only bounce rays that reflect in the same direction as the incident normal
        return dot((*scattered).dir, rec.normal) > 0;
    }

    return false;
}

///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Sphere
struct sphere {
    center: vec3<f32>,
    radius: f32,
    mat: material, // TODO: index into storage buffer of materials
}

fn sphere_hit(s: sphere, r: ray, t_min: f32, t_max: f32, rec: ptr<function, hit_record>) -> bool {
    let oc = r.orig - s.center;
    let a = length_squared(r.dir);
    let half_b = dot(oc, r.dir);
    let c = length_squared(oc) - s.radius*s.radius;
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
    let outward_normal = ((*rec).p - s.center) / s.radius;
    hit_record_set_face_normal(rec, r, outward_normal);
    (*rec).mat = s.mat;

    return true;
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Hittable List
const MAX_NUM_SPHERES = 10;
struct hittable_list {
    spheres: array<sphere, MAX_NUM_SPHERES>, // TODO: remove fixed size, make this a uniform input struct
    spheres_size: u32,
}

fn hittable_list_add_sphere(list: ptr<function, hittable_list>, s: sphere) {
    (*list).spheres[(*list).spheres_size] = s;
    (*list).spheres_size += 1;
}

fn hittable_list_hit(list: ptr<function, hittable_list>, r: ray, t_min: f32, t_max: f32, rec: ptr<function, hit_record>) -> bool {
    var temp_rec: hit_record;
    var hit_anything = false;
    var closest_so_far = t_max;

    for (var i = 0u; i < (*list).spheres_size; i += 1u) {
        let s = ((*list).spheres)[i];
        // TODO: remove once we pass in this data as uniform
        if (s.radius == 0.0) {
            continue;
        }
        if (sphere_hit(s, r, t_min, closest_so_far, &temp_rec)) {
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
struct camera {
    origin: vec3<f32>,
    lower_left_corner: vec3<f32>,
    horizontal: vec3<f32>,
    vertical: vec3<f32>,
}

fn camera_create(aspect_ratio: f32) -> camera {
    let viewport_height = 2.0;
    let viewport_width = aspect_ratio * viewport_height;
    const focal_length = 1.0;

    let origin = vec3(0.0, 0.0, 0.0);
    let horizontal = vec3(viewport_width, 0.0, 0.0);
    let vertical = vec3(0.0, viewport_height, 0.0);
    let lower_left_corner = origin - horizontal/2 - vertical/2 - vec3(0, 0, focal_length);
    return camera(origin, lower_left_corner, horizontal, vertical);
}

fn camera_get_ray(cam: ptr<function, camera>, u: f32, v: f32) -> ray {
    return ray(
        (*cam).origin,
        (*cam).lower_left_corner + u * (*cam).horizontal + v * (*cam).vertical - (*cam).origin
    );
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Random

// Implementation copied from https://webgpu.github.io/webgpu-samples/samples/particles#./particle.wgsl
var<private> rand_seed : vec2<f32>;

fn init_rand(invocation_id : u32, seed : vec4<f32>) {
  rand_seed = seed.xz;
  rand_seed = fract(rand_seed * cos(35.456+f32(invocation_id) * seed.yw));
  rand_seed = fract(rand_seed * cos(41.235+f32(invocation_id) * seed.xw));
}

// Returns random value in [0.0, 1.0)
fn random_f32() -> f32 {
  rand_seed.x = fract(cos(dot(rand_seed, vec2<f32>(23.14077926, 232.61690225))) * 136.8168);
  rand_seed.y = fract(cos(dot(rand_seed, vec2<f32>(54.47856553, 345.84153136))) * 534.7645);
  return rand_seed.y;
}

fn random_range_f32(min: f32, max: f32) -> f32 {
    return mix(min, max, random_f32());
}

fn random_vec3f() -> vec3<f32> {
    return vec3(random_f32(), random_f32(), random_f32());
}

fn random_range_vec3f(min: f32, max: f32) -> vec3<f32> {
    return vec3(random_range_f32(min, max), random_range_f32(min, max), random_range_f32(min, max));
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Main

@group(0) @binding(0)
var<storage, read_write> output : array<u32>;

const infinity = 3.402823466e+38; // NOTE: largest f32 instead of inf
const pi = 3.1415926535897932385;

fn random_in_unit_sphere() -> vec3<f32> {
    var p : vec3<f32>;
    while (true) {
        p = random_range_vec3f(-1, 1);
        if (length_squared(p) >= 1) {
            continue;
        }
        break;
    }
    return p;
}

fn random_unit_vector() -> vec3<f32> {
    return normalize(random_in_unit_sphere());
}

fn random_in_hemisphere(normal: vec3<f32>) -> vec3<f32> {
    let in_unit_sphere = random_in_unit_sphere();
    if (dot(in_unit_sphere, normal) > 0.0) { // In the same hemisphere as the normal
        return in_unit_sphere;
    }
    else {
        return -in_unit_sphere;
    }
}

fn ray_color(in_r: ray, world: ptr<function, hittable_list>, in_max_depth: i32) -> color {
    // Book uses recursion for bouncing rays. We can't recurse in WGSL, so convert algorithm to procedural.
    var r = in_r;
    var c : color = color(0,0,0);
    var rec: hit_record;
    var max_depth = in_max_depth;
    var hit_count = 1; // Start at 1 for the "no hit" case

    while (true) {
        if (hittable_list_hit(world, r, 0.001, infinity, &rec)) {
           var attenuation: color;
           var scattered: ray;
            if (material_scatter(rec.mat, r, rec, &attenuation, &scattered)) {
                hit_count += 1;
                c += attenuation;
                r = scattered;
            } else {
                // Material does not contribute, final color is black
                c = color(0,0,0);
                break;
            }

        } else {
            // If we hit nothing, return a blue sky color (linear blend of ray direction with white and blue)
            let unit_direction = normalize(r.dir);
            let t = 0.5 * (unit_direction.y + 1.0);
            c += (1.0 - t) * color(1.0, 1.0, 1.0) + t * color(0.5, 0.7, 1.0);
            break;
        }

        // If we've exceeded the ray bounce limit, no more light is gathered.
        max_depth -= 1;
        if (max_depth <= 0) {
            c = color(0,0,0);
            break;
        }
    }

    c /= f32(hit_count);
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

fn write_color(offset: u32, pixel_color: color, samples_per_pixel: u32) {
    var c = pixel_color;
    // Divide the color by the number of samples.
    c /= f32(samples_per_pixel);

    // And gamma-correct for gamma=2.0.
    // c = sqrt(c);

    output[offset] = color_to_u32(c);
}

@compute @workgroup_size(${wgSize})
fn main(
    @builtin(global_invocation_id) global_invocation_id : vec3<u32>,
    ) {
        init_rand(global_invocation_id.x, vec4(vec3<f32>(global_invocation_id), 1.0));

        // Compute current x,y
        let offset = global_invocation_id.x;
        let x = f32(offset % ${width});
        let y = ${height} - f32(offset / ${width}); // Flip Y so Y+ is up

        // Image
        const aspect_ratio = ${width} / ${height};
        const image_width = ${width};
        const image_height = ${height};
        const samples_per_pixel = 100;
        const max_depth = 50;

        // World
        var world: hittable_list;

        let material_ground = material_create_lambertian(color(0.8, 0.8, 0.0));
        let material_center = material_create_lambertian(color(0.7, 0.3, 0.3));
        let material_left = material_create_metal(color(0.8, 0.8, 0.8));
        let material_right = material_create_metal(color(0.8, 0.6, 0.2));

        hittable_list_add_sphere(&world, sphere(vec3( 0.0, -100.5, -1.0), 100.0, material_ground));
        hittable_list_add_sphere(&world, sphere(vec3( 0.0,    0.0, -1.0),   0.5, material_center));
        hittable_list_add_sphere(&world, sphere(vec3(-1.0,    0.0, -1.0),   0.5, material_left));
        hittable_list_add_sphere(&world, sphere(vec3( 1.0,    0.0, -1.0),   0.5, material_right));

        // Camera
        var cam = camera_create(aspect_ratio);

        // Render
        var pixel_color = color(0.0, 0.0, 0.0);
        for (var i = 0; i < samples_per_pixel; i += 1) {
            let u = (x + random_f32()) / (image_width - 1);
            let v = (y + random_f32()) / (image_height - 1);
            let r = camera_get_ray(&cam, u, v);
            pixel_color += ray_color(r, &world, max_depth);
        }

        // Store color for current pixel
        write_color(offset, pixel_color, samples_per_pixel);
}
///////////////////////////////////////////////////////////////////////////////
        `;

        return wgsl;
    }
}
