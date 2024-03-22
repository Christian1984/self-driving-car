export const Point = (x: number, y: number) => {
  return { x, y };
};

export type PointType = ReturnType<typeof Point>;

export const Segment = (start: PointType, end: PointType) => {
  return { start, end };
};

export type SegmentType = ReturnType<typeof Segment>;
