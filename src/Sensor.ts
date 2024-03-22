import { Point, PointType, Segment, SegmentType } from "./Geometry";
import { lerp } from "./utils";

export const Sensor = (rayCount: number, rayLength: number, raySpread: number) => {
  let rays: SegmentType[] = [];

  const castRays = (carPos: PointType, carAngle: number) => {
    rays = [];
    for (let i = 0; i < rayCount; i++) {
      const rayAngle = rayCount > 1 ? lerp(carAngle - raySpread / 2, carAngle + raySpread / 2, i / (rayCount - 1)) : 0;
      const rayStart = carPos;
      const rayEnd = Point(carPos.x + Math.sin(rayAngle) * rayLength, carPos.y - Math.cos(rayAngle) * rayLength);
      rays.push(Segment(rayStart, rayEnd));
    }
  };

  return {
    update: (carPos: PointType, carAngle: number) => {
      castRays(carPos, carAngle);
    },
    draw: (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";

      for (const ray of rays) {
        ctx.moveTo(ray.start.x, ray.start.y);
        ctx.lineTo(ray.end.x, ray.end.y);
      }

      ctx.stroke();
    },
  };
};
