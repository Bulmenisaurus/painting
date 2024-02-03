import { Perlin } from './perlin';
import { physics } from './phsyics';
import { HEIGHT, WIDTH, render } from './render';

const main = () => {
    const canvasElement = document.getElementById('main') as HTMLCanvasElement;
    canvasElement.width = WIDTH;
    canvasElement.height = HEIGHT;

    const physicsRenderContainer = document.getElementById('physics') as HTMLCanvasElement;

    const ctx = canvasElement.getContext('2d')!;

    window.requestAnimationFrame((time) => render(ctx, time));
    physics(physicsRenderContainer);
};

main();
