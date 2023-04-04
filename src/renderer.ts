/// <reference types="@webgpu/types" />

import { vec3 } from 'gl-matrix'

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
    addLambertian(albedo: vec3) {
        const b = new ArrayBuffer(64);
        const w = new BufferWriter(b);
        // ty
        w.setU32(0, 0); // ty
        w.setVec3f(16, albedo);
        this.add(b);
    }

    addMetal(albedo: vec3, fuzz: number) {
        const b = new ArrayBuffer(64);
        const w = new BufferWriter(b);
        w.setU32(0, 1); // ty
        w.setVec3f(32, albedo);
        this.add(b);
    }

    addDieletric(ir: number) {
        const b = new ArrayBuffer(64);
        const w = new BufferWriter(b);
        w.setU32(0, 2); // ty
        w.setF32(48, ir);
        this.add(b);
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
        this.aperture(2.0);
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
    numGroups: number;
    outputBuffer: GPUBuffer;
    materialsBuffer: GPUBuffer;
    hittableListBuffer: GPUBuffer;
    cameraCreateParamsBuffer: GPUBuffer;
    bindings = {
        output: 0,
        materials: 1,
        hittable_list: 2,
        camera_create_params: 3
    }

    materials: Materials;
    hittableList: HittableList;
    cameraCreateParams: CameraCreateParams;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    async init() {
        if (await this.initializeAPI()) {
            await this.onResize();
        }
    }

    createScene1() {
        this.materials = new Materials();
        this.materials.addLambertian(vec3.fromValues(0.8, 0.8, 0.0));
        this.materials.addLambertian(vec3.fromValues(0.1, 0.2, 0.5));
        this.materials.addDieletric(1.5);
        this.materials.addMetal(vec3.fromValues(0.8, 0.6, 0.2), 0.0);

        this.hittableList = new HittableList();
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
        this.cameraCreateParams = new CameraCreateParams()
            .lookfrom(lookfrom)
            .lookat(lookat)
            .vup(vec3.fromValues(0, 1, 0))
            .focus_dist(focus_dist)
            .aperture(2.0)
            .vfov(20.0)
            .aspect_ratio(this.canvas.width / this.canvas.height);
    }

    updatePipeline(wgSize: number) {
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
            size: this.hittableList.buffer.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true,
        });
        Copy(this.cameraCreateParams.buffer, this.cameraCreateParamsBuffer.getMappedRange());
        this.cameraCreateParamsBuffer.unmap();

        const code = this.computeShader(wgSize, this.materials.count, this.hittableList.count);
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
            ],
        });
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

            // Output buffer
            {
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
            }

            this.createScene1();
            this.updatePipeline(wgSize);

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

        if (this.pipeline === undefined) {
            return;
        }

        const encoder = this.device.createCommandEncoder();

        const pass = encoder.beginComputePass();
        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, this.bindGroup);
        pass.dispatchWorkgroups(this.numGroups);
        pass.end();

        // Copy output from compute shader to canvas
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
        encoder.copyBufferToTexture(imageCopyBuffer, imageCopyTexture, extent);

        commandBuffers.push(encoder.finish());


        this.queue.submit(commandBuffers);
    };

    computeShader(wgSize: number, numMaterials: number, numSpheres: number): string {
        const width = this.canvas.width;
        const height = this.canvas.height;

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
    var p : vec3f;
    while (true) {
        p = random_range_vec3f(-1, 1);
        if (length_squared(p) >= 1) {
            continue;
        }
        break;
    }
    return p;
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
    var p : vec3f;
    while (true) {
        p = vec3f(random_range_f32(-1,1), random_range_f32(-1,1), 0);
        if (length_squared(p) >= 1) {
            continue;
        }
        break;
    }
    return p;
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

fn random_vec3f() -> vec3f {
    return vec3(random_f32(), random_f32(), random_f32());
}

fn random_range_vec3f(min: f32, max: f32) -> vec3f {
    return vec3(random_range_f32(min, max), random_range_f32(min, max), random_range_f32(min, max));
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Main

@group(0) @binding(${this.bindings.output})
var<storage, read_write> output : array<u32>;

@group(0) @binding(${this.bindings.camera_create_params})
var<uniform> cp: camera_create_params;

const infinity = 3.402823466e+38; // NOTE: largest f32 instead of inf
const pi = 3.1415926535897932385;

fn ray_color(in_r: ray, in_max_depth: i32) -> color {
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

fn write_color(offset: u32, pixel_color: color, samples_per_pixel: u32) {
    var c = pixel_color;
    // Divide the color by the number of samples.
    c /= f32(samples_per_pixel);

    // And gamma-correct for gamma=2.0.
    c = sqrt(c);

    output[offset] = color_to_u32(c);
}

@compute @workgroup_size(${wgSize})
fn main(
    @builtin(global_invocation_id) global_invocation_id : vec3<u32>,
    ) {
        init_rand(global_invocation_id.x, vec4(vec3f(global_invocation_id), 1.0));

        // Camera
        var cam = camera_create(cp);

        // Render
        // Compute current x,y
        let offset = global_invocation_id.x;
        let x = f32(offset % ${width});
        let y = ${height} - f32(offset / ${width}); // Flip Y so Y+ is up
        const image_height = ${height};
        const image_width = ${width};
        const samples_per_pixel = 100;
        const max_depth = 50;

        var pixel_color = color(0.0, 0.0, 0.0);
        for (var i = 0; i < samples_per_pixel; i += 1) {
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
