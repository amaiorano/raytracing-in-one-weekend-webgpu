import Renderer from './renderer';

class App {
    canvas: HTMLCanvasElement;
    renderer: Renderer
    lastTimeStampMs: DOMHighResTimeStamp;

    elapsedTime = 0;

    constructor(canvas: HTMLCanvasElement) {
        canvas.width = canvas.height = 64 * 12;
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
    }

    async run() {
        this.init();
        await this.renderer.init();

        const updateLoop = (timeStampMs: DOMHighResTimeStamp) => {
            // Compute delta time in seconds
            const dt = (timeStampMs - this.lastTimeStampMs) / 1000;
            this.lastTimeStampMs = timeStampMs;
            this.render(dt);
            requestAnimationFrame(updateLoop);
        }

        // Start the update loop
        this.lastTimeStampMs = performance.now();
        updateLoop(this.lastTimeStampMs);
    }

    init() {
    }

    render(dt: number) {
        this.renderer.render(dt);
    }

    keysPressed = {};

    onKeyDown(event: KeyboardEvent) {
        this.keysPressed[event.code] = true;
    }

    onKeyUp(event: KeyboardEvent) {
        delete this.keysPressed[event.code];
    }
}

const canvas = document.getElementById('gfx') as HTMLCanvasElement;
const app = new App(canvas);

window.addEventListener("keydown", (event: KeyboardEvent) => {
    app.onKeyDown(event);
}, true);

window.addEventListener("keyup", (event: KeyboardEvent) => {
    app.onKeyUp(event);
}, true);

window.onload = () => {
}

app.run();
