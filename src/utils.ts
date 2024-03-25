import { Point, SegmentType } from "./Geometry";

export const lerp = (start: number, end: number, progress: number) =>
  start + (end - start) * progress;

export const getIntersection = (s1: SegmentType, s2: SegmentType) => {
  const tTop =
    (s2.end.x - s2.start.x) * (s1.start.y - s2.start.y) -
    (s2.end.y - s2.start.y) * (s1.start.x - s2.start.x);
  const uTop =
    (s2.start.y - s1.start.y) * (s1.start.x - s1.end.x) -
    (s2.start.x - s1.start.x) * (s1.start.y - s1.end.y);
  const bottom =
    (s2.end.y - s2.start.y) * (s1.end.x - s1.start.x) -
    (s2.end.x - s2.start.x) * (s1.end.y - s1.start.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        point: Point(
          lerp(s1.start.x, s1.end.x, t),
          lerp(s1.start.y, s1.end.y, t),
        ),
        distance: t,
      };
    }
  }

  return null;
};
