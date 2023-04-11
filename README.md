# Ray Tracing in One Weekend on WebGPU

This is an implementation of the ray tracer described in [Ray Tracing in One Weekend](https://raytracing.github.io/books/RayTracingInOneWeekend.html), but rather in TypeScript on WebGPU.

## Run

https://amaiorano.io/raytracing-in-one-weekend-webgpu/

Note that this should work on the latest version of [Chrome](https://www.google.com/intl/en_us/chrome/) as I registered for a WebGPU [Origin Trial](https://developer.chrome.com/origintrials). Otherwise, you'll need a browser that supports WebGPU, such as [Chrome Canary](https://www.google.com/intl/en_ca/chrome/canary/), and enable experimental support by setting the `https://chrome://flags/#enable-unsafe-webgpu` flag.

## About

This project was written during a "hack-week" on the WebGPU team at Google with the goal of learning and testing the [WebGPU API](//webgpu.dev).

## Build

Install [Node.js](https://nodejs.org/en/). Then, 
clone the repo, and install node dependencies:

```bash
git clone https://github.com/amaiorano/raytracing-in-one-weekend-webgpu.git
cd raytracing-in-one-weekend-webgpu
npm install
```

For development, run `npm start` to start a local web server that watches and recompiles on the fly as source is changed. Navigate to http://localhost:4000 to play the game.

For production, compile the project with `npm run build`. The files will be output to the `dist/` directory.

## Design

The book describes how to write a ray tracer in C++. My goal was to read through the book, and adapt the code as it progressed in TypeScript on WebGPU. I tried my best to keep the code as similar to the book as possible. Since this code is mostly implemented in WGSL, though, I had to make some changes due to the limitations of the language:

* **No templates, inheritance/polymorphism, function pointers, function overloads, discriminated unions, or enums.** Without any of these features, it was a little more challenging to implement the polymorphic types presented in the book, such as the `material` hierarchy. I worked around this by having a struct for each material type (e.g. `lambertian_material`), and having the `material` struct contain an instance of each type, with a u32 set to a unique value to indicate which one was to be read. The virtual `scatter` function was implemented as a function `material_scatter` that simply applies the material based on the unique type of the input material.

* **No random number generator.** Shading languages do not usually provide any facilities to generate random numbers, you must implement this yourself. For this project, I used the [solution implemented in this WebGPU sample](https://webgpu.github.io/webgpu-samples/samples/particles#./particle.wgsl) that uses a combination of `fract` and `cos`, along with seed values provided to the shader via uniforms.

* **No recursion.** The book implements the core ray-casting function, `ray_color`, by recursively calling itself when a ray bounces off an object. WGSL, like most shading languages, does not support recursion, so I reimplemented the algorithm to work procedurally by looping and accumulating the final color for the ray.

The overall design of the ray tracer is as follows:

* A compute shader invocation (i.e. unique global invocation id) is responsible for computing the final color of a single pixel in the output image. The workgroup size is (64,1,1), so the number of workgroups dispatched is image (width * height / 64). As this is not a perfect multiple of the number of pixels to be rendered, any invocations with a global invocation id >= (width * height) simply returns.

* The final pixel color computed by the shader is a normalized RGB value that gets converted to `bgra8unorm` and is stored into a storage buffer. Because each invocation writes to a single location in the storage buffer, there are no data races, so no atomics or barriers are used. This storage buffer is then simply copied to the canvas using WebGPU's `copyBufferToTexture`. Because this function does not support scaling, the canvas size is set to the maximum possible resolution that the user can select.

* For multisampling, initially the compute shader would loop for the number of samples desired, and produce a final color. However, this would result in very long frames of compute execution, and would often time out and result in a "device lost" errors. I changed this to spread out the computation over multiple frames, and composites the final result into the output storage buffer. 
