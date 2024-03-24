import { Point, PointType, Segment, SegmentType } from "../../Geometry";
import "../../style.scss";
import { lerp } from "../../utils";

const debug = true;

const frameTimeReference = 17;
let lastFrame = Date.now();
let avgFrameTime = -1;
let avgFrameTimeSamples = 0;

const c = document.querySelector<HTMLCanvasElement>("canvas")!;

const ctx = c.getContext("2d")!;

const p1 = Point(100, 100);
const p2 = Point(500, 500);

const p3 = Point(350, 50);
const p4 = Point(150, 400);

const p5 = Point(500, 100);
const p6 = Point(500, 600);

const p7 = Point(300, 200);
const p8 = Point(800, 200);

let s1 = Segment(p1, p2);
const s2 = Segment(p3, p4);
const s3 = Segment(p5, p6);
const s4 = Segment(p7, p8);

const segments = [s2, s3, s4];

let mouse = Point(0, 0);

document.addEventListener("mousemove", (e) => {
    mouse = Point(e.clientX, e.clientY);
});

const getIntersect = (s1: SegmentType, s2: SegmentType): PointType | null => {
    /*
    I needs to be on s1 (A, B) and s2 (C, D), hence it must satisfy both "lerps"
    Ix = Ax + (Bx - Ax) * t = Cx + (Dx - Cx) * u (1)
    Iy = Ay + (By - Ay) * t = Cy + (Dy - Cy) * u (2)

    (1) -> Ax + (Bx - Ax)t = Cx + (Dx - Cx)u | -Cx
           (Ax - Cx) + (Bx - Ax)t = (Dx - Cx)u (3)
    (2) -> Ay + (By - Ay)t = Cy + (Dy - Cy)u | -Cy
           (Ay - Cy) + (By - Ay)t = (Dy - Cy)u | * (Dx - Cx)

           (Dx - Cx)(Ay - Cy) + (Dx - Cx)(By - Ay)t = (Dx - Cx)(Dy - Cy)u | with (3)
           (Dx - Cx)(Ay - Cy) + (Dx - Cx)(By - Ay)t = ((Ax - Cx) + (Bx - Ax)t)(Dy - Cy)
           (Dx - Cx)(Ay - Cy) + (Dx - Cx)(By - Ay)t = (Ax - Cx)(Dy - Cy) + (Bx - Ax)(Dy - Cy)t | - (Ax - Cx)(Dy - Cy)
           (Dx - Cx)(Ay - Cy) - (Ax - Cx)(Dy - Cy) + (Dx - Cx)(By - Ay)t = (Bx - Ax)(Dy - Cy)t | + (Dx - Cx)(By - Ay)t 
           (Dx - Cx)(Ay - Cy) - (Ax - Cx)(Dy - Cy) = ((Bx - Ax)(Dy - Cy) - (Dx - Cx)(By - Ay))t
           t = (Dx - Cx)(Ay - Cy) - (Ax - Cx)(Dy - Cy) / ((Bx - Ax)(Dy - Cy) - (Dx - Cx)(By - Ay))
           t = tTop / tBottom
           tTop = (Dx - Cx)(Ay - Cy) - (Ax - Cx)(Dy - Cy) 
           tBottom = (Bx - Ax)(Dy - Cy) - (Dx - Cx)(By - Ay)
    */

    const ax = s1.start.x;
    const ay = s1.start.y;
    const bx = s1.end.x;
    const by = s1.end.y;

    const cx = s2.start.x;
    const cy = s2.start.y;
    const dx = s2.end.x;
    const dy = s2.end.y;

    const tTop = (dx - cx) * (ay - cy) - (ax - cx) * (dy - cy);
    const tBottom = (bx - ax) * (dy - cy) - (dx - cx) * (by - ay);

    if (tBottom == 0) return null;

    const t = tTop / tBottom;
    if (t < 0 || t > 1) return null;

    let uBottom = dx - cx;
    let uTop = ax - cx + (bx - ax) * t;

    if (uBottom == 0) {
        // this is the case if s2 is vertical
        uBottom = dy - cy;
        uTop = ay - cy + (by - ay) * t;
    }

    if (uBottom == 0) return null;

    const u = uTop / uBottom;
    if (u < 0 || u > 1) return null;

    const nx = lerp(s1.start.x, s1.end.x, t);
    const ny = lerp(s1.start.y, s1.end.y, t);
    // const nx = lerp(s2.start.x, s2.end.x, u);
    // const ny = lerp(s2.start.y, s2.end.y, u);

    return Point(nx, ny);
};

const drawSegment = (labelStart: string, labelEnd: string, segment: SegmentType) => {
    ctx.beginPath();
    ctx.moveTo(segment.start.x, segment.start.y);
    ctx.lineTo(segment.end.x, segment.end.y);
    ctx.stroke();

    drawPoint(labelStart, segment.start);
    drawPoint(labelEnd, segment.end);
};

const drawPoint = (label: string, point: PointType) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "normal 16px Verdana";
    ctx.fillText(label, point.x, point.y);
};

const animate = () => {
    c.height = window.innerHeight; // this automatically clears the canvas
    c.width = window.innerWidth;

    const now = Date.now();
    const frameTime = now - lastFrame;
    lastFrame = now;

    s1 = Segment(Point(mouse.x + 50, mouse.y + 50), Point(mouse.x - 50, mouse.y - 50));

    drawSegment("A", "B", s1);

    let intersections: PointType[] = [];

    for (const [i, segment] of segments.entries()) {
        drawSegment(`${2 * i}`, `${2 * i + 1}`, segment);

        for (const [j, segment2] of segments.entries()) {
            if (j <= i) continue;
            const n = getIntersect(segment, segment2);

            if (n) {
                intersections.push(n);
            }
        }

        const n = getIntersect(s1, segment);

        if (n) {
            intersections.push(n);
        }
    }

    for (const [i, n] of intersections.entries()) {
        drawPoint(`N${i}`, n);
    }

    if (debug) {
        if (avgFrameTimeSamples == 0) {
            avgFrameTime = frameTime;
        } else {
            avgFrameTime = (avgFrameTime * avgFrameTimeSamples + frameTime) / (avgFrameTimeSamples + 1);
        }

        avgFrameTimeSamples++;

        ctx.textAlign = "start";
        ctx.textBaseline = "bottom";
        ctx.font = "normal 10px Verdana";

        ctx.fillStyle = "red";
        ctx.fillText("Frametime", 10, 10);
        ctx.fillText(`Cur: ${frameTime}`, 10, 20);
        ctx.fillText(`Avg: ${Math.round(avgFrameTime)}`, 10, 30);

        ctx.fillText("FPS", 10, 50);
        ctx.fillText(`Cur: ${Math.round(1000 / frameTime)}`, 10, 60);
        ctx.fillText(`Avg: ${Math.round(1000 / avgFrameTime)}`, 10, 70);

        ctx.fillText("Intersections", 10, 90);
        ctx.fillText(`Found: ${intersections.length}`, 10, 100);
    }

    requestAnimationFrame(animate);
};

animate();
