import { Point, PointType, Segment, SegmentType } from "./Geometry";
import { getIntersection, lerp } from "./utils";

export const Sensor = (rayCount: number, rayLength: number, raySpread: number) => {
  let rays: SegmentType[] = [];
  let readings: number[] = [];

  const castRays = (carPos: PointType, carAngle: number) => {
    rays = [];
    for (let i = 0; i < rayCount; i++) {
      const rayAngle = rayCount > 1 ? lerp(carAngle - raySpread / 2, carAngle + raySpread / 2, i / (rayCount - 1)) : 0;
      const rayStart = carPos;
      const rayEnd = Point(carPos.x + Math.sin(rayAngle) * rayLength, carPos.y - Math.cos(rayAngle) * rayLength);
      rays.push(Segment(rayStart, rayEnd));
    }
  };

  const getReading = (ray: SegmentType, roadBorders: SegmentType[]) => {
    const touches: { point: PointType; distance: number }[] = [];

    for (const border of roadBorders) {
      const touch = getIntersection(ray, border);

      if (touch) {
        touches.push(touch);
      }
    }

    if (touches.length === 0) return 0;

    const distances = touches.map((touch) => touch.distance);
    const minDistance = Math.min(...distances);

    return minDistance;
  };

  return {
    update: (carPos: PointType, carAngle: number, roadBorders: SegmentType[]) => {
      castRays(carPos, carAngle);

      readings = [];
      for (const ray of rays) {
        readings.push(getReading(ray, roadBorders));
      }
    },
    draw: (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = 2;

      for (let i = 0; i < rays.length; i++) {
        const ray = rays[i];

        ctx.save();
        ctx.translate(ray.start.x, ray.start.y);

        ctx.beginPath();
        ctx.strokeStyle = "yellow";
        ctx.moveTo(0, 0);
        ctx.lineTo(ray.end.x - ray.start.x, ray.end.y - ray.start.y);
        ctx.stroke();

        const reading = readings[i];
        ctx.beginPath();
        ctx.strokeStyle = "orange";
        ctx.moveTo(0, 0);
        ctx.lineTo((ray.end.x - ray.start.x) * reading, (ray.end.y - ray.start.y) * reading);
        // ctx.lineTo((ray.end.x - ray.start.x) * reading + ray.start.x, (ray.end.y - ray.start.y) * reading + ray.start.y);
        ctx.stroke();
        ctx.restore();
      }
    },
  };
};
