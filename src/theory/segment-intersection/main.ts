import "../../style.scss";

const debug = true;

let lastFrame = Date.now();
let avgFrameTime = -1;
let avgFrameTimeSamples = 0;

const max_road_length = 100000;
const lanes = 3;

const c = document.querySelector<HTMLCanvasElement>("canvas")!;

const ctx = c.getContext("2d")!;

const animate = () => {
  c.height = window.innerHeight; // this automatically clears the canvas
  c.width = window.innerWidth;

  if (debug) {
    const now = Date.now();
    const frameTime = now - lastFrame;
    lastFrame = now;

    if (avgFrameTimeSamples == 0) {
      avgFrameTime = frameTime;
    } else {
      avgFrameTime = (avgFrameTime * avgFrameTimeSamples + frameTime) / (avgFrameTimeSamples + 1);
    }

    avgFrameTimeSamples++;

    ctx.fillStyle = "red";
    ctx.fillText("Frametime", 10, 10);
    ctx.fillText(`Cur: ${frameTime}`, 10, 20);
    ctx.fillText(`Avg: ${Math.round(avgFrameTime)}`, 10, 30);

    ctx.fillText("FPS", 10, 50);
    ctx.fillText(`Cur: ${Math.round(1000 / frameTime)}`, 10, 60);
    ctx.fillText(`Avg: ${Math.round(1000 / avgFrameTime)}`, 10, 70);
  }

  requestAnimationFrame(animate);
};

animate();
