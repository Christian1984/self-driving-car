import { Controls } from "./Controls";

export const Car = (x: number, y: number, width: number, height: number) => {
  const { directions } = Controls();

  let speed = 0;
  const maxSpeed = 5;
  const acceleration = 0.2;
  const drag = 0.02;

  let angle = 0;
  const rotation = 0.03;

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.rect(-width / 2, -height / 2, width, height);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(-width / 2 + 10, -height / 2 + 10, 5, 0, 2 * Math.PI);
    ctx.arc(width / 2 - 10, -height / 2 + 10, 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.rect(-width / 2 + 5, height / 2 - 10, 10, 5);
    ctx.rect(width / 2 - 15, height / 2 - 10, 10, 5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.strokeStyle = "red";
    const length = speed * 50;
    // ctx.rotate(-angle);
    // ctx.lineTo(length * Math.sin(angle), -length * Math.cos(angle));
    ctx.lineTo(0, -length);
    ctx.stroke();

    ctx.restore();
  };

  const update = () => {
    move();
  };

  const move = () => {
    if (directions.forward) {
      speed += acceleration;
    }

    if (directions.reverse) {
      speed -= acceleration;
    }

    if (directions.right) {
      angle += (rotation * speed) / maxSpeed;
    }

    if (directions.left) {
      angle -= (rotation * speed) / maxSpeed;
    }

    if (Math.abs(speed) <= drag) {
      speed = 0;
    }

    if (speed > 0) {
      if (speed > maxSpeed) {
        speed = maxSpeed;
      }

      speed -= drag;
    } else if (speed < 0) {
      if (speed < -maxSpeed / 2) {
        speed = -maxSpeed / 2;
      }

      speed += drag;
    }

    x += speed * Math.sin(angle);
    y -= speed * Math.cos(angle);
  };

  return { draw, update };
};
