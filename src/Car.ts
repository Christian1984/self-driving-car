import { Controls } from "./Controls";
import { Point, PointType, Segment, SegmentType } from "./Geometry";
import { Sensor } from "./Sensor";
import { getIntersection } from "./utils";

export const Car = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: string = "black",
  debug: boolean = false,
) => {
  const { directions } = Controls();

  const initialPos = { x: x, y: y };

  let speed = 0;
  const maxSpeed = 5;
  const acceleration = 0.2;
  const drag = 0.02;

  let angle = 0;
  const rotation = 0.03;

  const sensor = Sensor(5, 200, (Math.PI * 2) / 3);

  let polygon: PointType[] = [];
  let damaged = false;

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = color;
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
    ctx.fillStyle = "blue";
    ctx.rect(-width / 2 + 5, -height / 2 + 28, width - 10, 20);
    ctx.fill();

    ctx.restore();

    ctx.beginPath();
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 3;
    for (const [i, p] of polygon.entries()) {
      if (i == 0) {
        const pStart = polygon[polygon.length - 1];
        ctx.moveTo(pStart.x, pStart.y);
      }

      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    sensor.draw(ctx);

    if (debug) {
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.strokeStyle = "red";
      const length = (speed / maxSpeed) * height;
      ctx.lineTo(0, -length);
      ctx.stroke();

      ctx.restore();
    }
  };

  const updatePolygon = () => {
    polygon = [];
    const points = [
      Point(-width / 2, -height / 2),
      Point(width / 2, -height / 2),
      Point(width / 2, height / 2),
      Point(-width / 2, height / 2),
    ];

    for (const p of points) {
      const px = p.x * Math.cos(angle) - p.y * Math.sin(angle) + x;
      const py = p.x * Math.sin(angle) + p.y * Math.cos(angle) + y;
      polygon.push(Point(px, py));
    }
  };

  const assessDamage = (roadBorders: SegmentType[]) => {
    for (const border of roadBorders) {
      for (const [i, p] of polygon.entries()) {
        let pStart = polygon[polygon.length - 1];

        if (i > 0) {
          let pStart = polygon[i - 1];
        }

        const s = Segment(pStart, p);

        const intersection = getIntersection(border, s);
        if (intersection) {
          damaged = true;
          return;
        }
      }
    }
  };

  const update = (roadBorders: SegmentType[]) => {
    if (!damaged) {
      move();
      updatePolygon();
      sensor.update({ x, y }, angle, roadBorders);
      assessDamage(roadBorders);
    }
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

  const getPos = () => Point(x, y);

  const getAngle = () => angle;

  const reset = () => {
    y = initialPos.y;
  };

  return { draw, update, getPos, getAngle, reset };
};

export type CarType = ReturnType<typeof Car>;
