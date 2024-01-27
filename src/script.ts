import { Perlin } from './perlin';

const WIDTH = 300;
const HEIGHT = 425;

export type Coordinate = { x: number; y: number };

const background = (ctx: CanvasRenderingContext2D) => {
    const perlin = new Perlin(50, 50, 0);
    console.log(perlin.getPixel(0, 5.1));
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            let pixelStyle = (perlin.getPixel(x / 50, y / 50) + 1) / 2;
            // convert [0, 1] to [startAlpha, endAlpha]
            const startAlpha = 170;
            const endAlpha = 250;

            const rgbValue = pixelStyle * (endAlpha - startAlpha) + startAlpha;

            ctx.fillStyle = `rgb(${rgbValue}, ${rgbValue}, ${rgbValue})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }
};

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

const rectangles = (ctx: CanvasRenderingContext2D) => {
    const packed: PackedRectangle[] = [
        [50, -10, 150, 25, 0.5],
        [240, 20, 80, 25, -0.05],
        [40, 150, 80, 30, -0.4],
        [250, 70, 90, 25, 0.8],
        [190, 120, 90, 25, 0.7],
        [165, 180, 90, 25, 1.15],
    ];

    const rects: Rectangle[] = packed.map((p) => ({
        x: p[0],
        y: p[1],
        width: p[2],
        height: p[3],
        rotation: p[4],
    }));

    ctx.fillStyle = '#73f0f5';

    for (let r of rects) {
        let vertices = [
            { x: r.x, y: r.y },
            { x: r.x + r.width, y: r.y },
            { x: r.x + r.width, y: r.y + r.height },
            { x: r.x, y: r.y + r.height },
        ].map((v) => rotateAround({ x: r.x, y: r.y }, v, r.rotation));

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

const gridLines = (ctx: CanvasRenderingContext2D) => {
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

const main = () => {
    const canvasElement = document.getElementById('main') as HTMLCanvasElement;
    canvasElement.width = WIDTH;
    canvasElement.height = HEIGHT;

    const ctx = canvasElement.getContext('2d')!;
    background(ctx);

    rectangles(ctx);

    gridLines(ctx);
};

main();
