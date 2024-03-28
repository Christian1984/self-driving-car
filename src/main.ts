import { Car, CarType } from "./Car";
import { Road } from "./Road";
import "./style.scss";

const debug = true;

let lastFrame = Date.now();
let avgFrameTime = -1;
let avgFrameTimeSamples = 0;

const max_road_length = 100000;
const lanes = 3;

const c = document.querySelector<HTMLCanvasElement>("canvas")!;
c.width = 500;

let cars: CarType[] = [];

const ctx = c.getContext("2d")!;

const road = Road(c.width, max_road_length, lanes);

const reset = () => {
  const car = Car(
    road.getLaneCenter(Math.floor(lanes / 2)),
    max_road_length / 2,
    50,
    100,
    "black",
    debug,
  );
  cars = [car];
};

const animate = () => {
  const now = Date.now();
  const frameTime = now - lastFrame;
  lastFrame = now;

  const delta = frameTime / 17;

  if (avgFrameTimeSamples == 0) {
    avgFrameTime = frameTime;
  } else {
    avgFrameTime =
      (avgFrameTime * avgFrameTimeSamples + frameTime) /
      (avgFrameTimeSamples + 1);
  }

  avgFrameTimeSamples++;

  c.height = window.innerHeight; // this automatically clears the canvas

  road.update(delta);

  for (const car of cars) {
    car.update(delta, road.getRoadBorders());

    if (car.getPos().y < 2 * window.innerHeight) {
      for (const c of cars) {
        c.reset();
      }
    }

    ctx.save();
    ctx.translate(0, -car.getPos().y + c.height * 0.7);
    road.draw(ctx);
    car.draw(ctx);
    ctx.restore();
  }

  if (debug) {
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

const addKeyboardListeners = () => {
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "r":
        reset();
        break;
    }
  });
};

addKeyboardListeners();
reset();
animate();
