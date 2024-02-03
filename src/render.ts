import { Perlin } from './perlin';

export const WIDTH = 300 * 2;
export const HEIGHT = 425 * 2;

export type Coordinate = { x: number; y: number };

const background = (ctx: CanvasRenderingContext2D) => {};

interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
}

type PackedRectangle = [number, number, number, number, number];

const rotateAround = (origin: Coordinate, p: Coordinate, angle: number): Coordinate => {
    // https://stackoverflow.com/a/2259502/13996389

    const { x: cx, y: cy } = origin;

    const s = Math.sin(angle);
    const c = Math.cos(angle);

    p.x -= cx;
    p.y -= cy;

    const xNew = p.x * c - p.y * s;
    const yNew = p.x * s + p.y * c;

    p.x = xNew + cx;
    p.y = yNew + cy;

    return p;
};

const randomOffset = (p: Coordinate, id: number, timing: number): Coordinate => {
    return {
        x: p.x + Math.cos(timing / 1000 + id) * 10,
        y: p.y + Math.sin(timing / 1000 - id) * 10,
    };
};

const rectangles = (ctx: CanvasRenderingContext2D, time: number) => {
    const packed: PackedRectangle[] = [
        [50, -10, 150, 25, 0.5],
        [240, 20, 80, 25, -0.05],
        [40, 150, 80, 30, -0.4],
        [250, 70, 90, 25, 0.8],
        [190, 120, 90, 25, 0.7],
        [165, 180, 90, 25, 1.15],
    ].map((p) => [p[0] * 2, p[1] * 2, p[2] * 2, p[3] * 2, p[4]] as PackedRectangle);

    const rects: Rectangle[] = packed.map((p) => ({
        x: p[0],
        y: p[1],
        width: p[2],
        height: p[3],
        rotation: p[4],
    }));

    ctx.fillStyle = '#fff';

    for (let r of rects) {
        let vertices = [
            { x: r.x, y: r.y },
            { x: r.x + r.width, y: r.y },
            { x: r.x + r.width, y: r.y + r.height },
            { x: r.x, y: r.y + r.height },
        ]
            .map((v) => rotateAround({ x: r.x, y: r.y }, v, r.rotation))
            .map((v, idx) => randomOffset(v, idx, time));

        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        ctx.lineTo(vertices[1].x, vertices[1].y);
        ctx.lineTo(vertices[2].x, vertices[2].y);
        ctx.lineTo(vertices[3].x, vertices[3].y);
        ctx.lineTo(vertices[0].x, vertices[0].y);
        ctx.fill();
        ctx.stroke();
    }
};

interface Triangle {
    v1: Coordinate;
    v2: Coordinate;
    v3: Coordinate;
    style: number;
}

type PackedTriangle = [number, number, number, number, number, number, number];

// https://www.desmos.com/calculator/toe5sw3rau
const rotateT = (t: Triangle, angle: number): Triangle => {
    const middlePoint = { x: (t.v1.x + t.v2.x + t.v3.x) / 3, y: (t.v1.y + t.v2.y + t.v3.y) / 3 };
    return {
        v1: rotateAround(middlePoint, t.v1, angle),
        v2: rotateAround(middlePoint, t.v2, angle),
        v3: rotateAround(middlePoint, t.v3, angle),
        style: t.style,
    };
};

const triangles = (ctx: CanvasRenderingContext2D, time: number) => {
    const packed: PackedTriangle[] = [
        [10, 205, 60, 230, 40, 300, 5],
        [40, 240, 10, 270, 50, 280, 3],
        [40, 260, 42, 297, 70, 290, 2.5],
        [30, 280, 70, 285, 75, 335, 2],
        [55, 285, 75, 275, 75, 315, 1.5],
        [55, 305, 85, 290, 80, 315, 1],

        [25, 390, 25, 375, 37, 382, 0.5],
        [20, 390, 30, 385, 29, 396, 0.1],
        // multiply coordinates by two
    ].map((p) => p.map((n) => n * 2) as PackedTriangle);

    const tris: Triangle[] = packed.map((t) => ({
        v1: { x: t[0], y: t[1] },
        v2: { x: t[2], y: t[3] },
        v3: { x: t[4], y: t[5] },
        style: t[6],
    }));

    for (let b of tris) {
        const r = rotateT(b, time / (3000 * b.style));

        ctx.fillStyle = '#FFF';

        ctx.beginPath();
        ctx.moveTo(r.v1.x, r.v1.y);
        ctx.lineTo(r.v2.x, r.v2.y);
        ctx.lineTo(r.v3.x, r.v3.y);
        ctx.lineTo(r.v1.x, r.v1.y);
        ctx.fill();
        ctx.stroke();
    }
};

const gridLines = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'black';
    for (let i = 0; i < 2; i++) {
        const x = (WIDTH / 3) * (i + 1);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
    }

    for (let i = 0; i < 3; i++) {
        const y = (HEIGHT / 4) * (i + 1);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
    }
};

const clear = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
};

export const render = (ctx: CanvasRenderingContext2D, timing: number) => {
    clear(ctx);
    background(ctx);

    rectangles(ctx, timing);
    triangles(ctx, timing);

    // drawHitboxes(ctx);
    // gridLines(ctx);

    window.requestAnimationFrame((timing) => render(ctx, timing));
};
