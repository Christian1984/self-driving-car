import { Point, Segment } from "./Geometry";
import { lerp } from "./utils";

export const Road = (width: number, height: number, lanes: number) => {
  const lineWidth = 5;

  return {
    getLaneCenter: (lane: number) => {
      if (lane < 0) lane = 0;
      if (lane > lanes - 1) lane = lanes - 1;

      return (
        lerp(lineWidth, width - lineWidth, lane / lanes) +
        (lerp(lineWidth, width - lineWidth, (lane + 1) / lanes) - lerp(lineWidth, width - lineWidth, lane / lanes)) / 2
      );
    },
    getRoadBorders: () => {
      return [
        Segment(Point(lineWidth, 0), Point(lineWidth, height)),
        Segment(Point(width - lineWidth, 0), Point(width - lineWidth, height)),
      ];
    },
    update: () => {},
    draw: (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = "white";

      for (let lane = 0; lane <= lanes; lane++) {
        ctx.beginPath();

        if (lane == 0 || lane == lanes) {
          ctx.setLineDash([]);
        } else {
          ctx.setLineDash([40, 40]);
        }

        const x = lerp(lineWidth, width - lineWidth, lane / lanes);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);

        ctx.stroke();
      }
    },
  };
};
