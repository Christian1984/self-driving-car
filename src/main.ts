import { Car } from "./Car";
import "./style.scss";

const c = document.querySelector<HTMLCanvasElement>("canvas")!;
c.width = 1000;

const ctx = c.getContext("2d")!;

const car = Car(100, 100, 50, 100);
car.draw(ctx);

const animate = () => {
  c.height = window.innerHeight;

  car.update();
  car.draw(ctx);
  requestAnimationFrame(animate);
};

animate();
