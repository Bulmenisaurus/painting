import { Coordinate } from './render';

export class Perlin {
    width: number;
    height: number;
    seed: number;
    gradients: Coordinate[];
    constructor(width: number, height: number, seed: number) {
        this.width = width;
        this.height = height;

        this.seed = seed;
        this.gradients = [];
        for (let i = 0; i < (this.width + 1) * (this.height + 1); i++) {
            const x = i % (this.width + 1);
            const y = Math.floor(i / (this.height + 1));
            this.gradients.push(this.getRandomGradient(x, y));
        }
    }

    getRandomGradient(x: number, y: number): Coordinate {
        let a = x;
        let b = y;
        let c = this.seed;
        let d = a + b;

        let t = 0;

        for (let i = 0; i < 20; i++) {
            a >>>= 0;
            b >>>= 0;
            c >>>= 0;
            d >>>= 0;
            t = (a + b) | 0;
            a = b ^ (b >>> 9);
            b = (c + (c << 3)) | 0;
            c = (c << 21) | (c >>> 11);
            d = (d + 1) | 0;
            t = (t + d) | 0;
            c = (c + t) | 0;
        }
        const random = (t >>> 0) / 4294967296;

        const angle = random * 2 * Math.PI;
        return { x: Math.cos(angle), y: Math.sin(angle) };
    }

    getDotProduct(x1: number, y1: number, x2: number, y2: number) {
        return x1 * x2 + y1 * y2;
    }

    calculateDotProduct(pointX: number, pointY: number, cornerX: number, cornerY: number) {
        const cornerGradient = this.gradients[cornerX + cornerY * this.height];
        const offsetX = pointX - cornerX;
        const offsetY = pointY - cornerY;

        const dotProduct = this.getDotProduct(cornerGradient.x, cornerGradient.y, offsetX, offsetY);

        return dotProduct;
    }

    smootherStep(x: number) {
        return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
    }

    interpolate(fromValue: number, toValue: number, byAmount: number) {
        return (toValue - fromValue) * this.smootherStep(byAmount) + fromValue;
    }

    getPixel(x: number, y: number) {
        // find the four corners of the tile the give point is in
        const cornerX0 = Math.floor(x);
        const cornerX1 = cornerX0 + 1;
        const cornerY0 = Math.floor(y);
        const cornerY1 = cornerY0 + 1;

        const offsetX = x - cornerX0;
        const offsetY = y - cornerY0;

        // generate the four dot products
        const dotProduct0 = this.calculateDotProduct(x, y, cornerX0, cornerY0); // top left
        const dotProduct1 = this.calculateDotProduct(x, y, cornerX1, cornerY0); // top right
        const dotProduct2 = this.calculateDotProduct(x, y, cornerX1, cornerY1); // bottom right
        const dotProduct3 = this.calculateDotProduct(x, y, cornerX0, cornerY1); // bottom left

        const interpolated0 = this.interpolate(dotProduct0, dotProduct1, offsetX);
        const interpolated1 = this.interpolate(dotProduct3, dotProduct2, offsetX);

        const interpolated2 = this.interpolate(interpolated0, interpolated1, offsetY);
        // interpolated2 ∊ [-1, 1]

        return interpolated2;
    }
}
