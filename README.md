# Ray Tracing in One Weekend on WebGPU

This is an implementation of the ray tracer described in [Ray Tracing in One Weekend](https://raytracing.github.io/books/RayTracingInOneWeekend.html), but rather in TypeScript on WebGPU.

## Run

**TODO: LINK HERE**

Note that this should work on the latest version of [Chrome](https://www.google.com/intl/en_us/chrome/) as I registered for a WebGPU [Origin Trial](https://developer.chrome.com/origintrials). Otherwise, you'll need a browser that supports WebGPU, such as [Chrome Canary](https://www.google.com/intl/en_ca/chrome/canary/), and enable experimental support by setting the `https://chrome://flags/#enable-unsafe-webgpu` flag.


## About

This project was written during a "hack-week" on the WebGPU team at Google with the goal of learning and testing the [WebGPU API](//webgpu.dev).

**TODO**

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

**TODO**
