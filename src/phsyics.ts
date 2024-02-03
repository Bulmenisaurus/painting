import Matter, {
    Engine,
    Render,
    Runner,
    Composites,
    Bodies,
    Common,
    Composite,
    Events,
    Body,
} from 'matter-js';

import { HEIGHT, PackedLineSegment, WIDTH } from './render';

export const getHitBoxes = (): PackedLineSegment[] => {
    return [
        [300, 50, 100, 290],
        [300, 130, 140, 310],
    ];
};

// https://github.com/liabru/matter-js/blob/master/examples/avalanche.js

export const physics = (container: HTMLCanvasElement) => {
    const engine = Engine.create();
    engine.timing.timeScale = 0.7;
    const world = engine.world;

    const render = Render.create({
        canvas: container,
        engine: engine,
        options: {
            width: WIDTH * 2,
            height: HEIGHT * 2,
            background: 'transparent',
            wireframeBackground: 'transparent',
            wireframes: false,
        },
    });

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);
    const stack = Composites.stack(700, -900, 7, 20, 0, 0, (x: number, y: number) => {
        return Bodies.circle(x, y, Common.random(10, 20), {
            friction: 0.00001,
            restitution: 0.5,
            density: 0.001,
            render: {
                fillStyle: 'white',
                lineWidth: 4,
                strokeStyle: 'black',
            },
        });
    });

    Composite.add(world, stack);
    Composite.add(
        world,
        [
            Bodies.rectangle(400, 330, 1000, 20, {
                isStatic: true,
                angle: Math.PI * 0.72,
            }),
            Bodies.rectangle(600, 290, 1100, 20, {
                isStatic: true,
                angle: Math.PI * 0.72,
            }),
            Bodies.rectangle(340, 800, 200, 20, {
                isStatic: true,
                angle: Math.PI * 0.25,
            }),
            Bodies.rectangle(160, 700, 400, 20, {
                isStatic: true,
                angle: Math.PI * 0.4,
            }),
            Bodies.rectangle(650, -130, 200, 20, {
                isStatic: true,
                angle: Math.PI * 0.25,
            }),
            Bodies.rectangle(590, -430, 500, 20, {
                isStatic: true,
                angle: Math.PI * 0.5,
            }),
            Bodies.rectangle(930, -380, 500, 20, {
                isStatic: true,
                angle: Math.PI * 0.5,
            }),
            Bodies.rectangle(340, 900, 200, 20, {
                isStatic: true,
                angle: Math.PI * 0,
                plugin: { outOfBoundsCollision: true },
            }),
        ].map((p) => ((p.render.visible = false), p))
    );

    // Render.lookAt(render, Composite.allBodies(world));

    Events.on(engine, 'collisionStart', (event) => {
        for (const collisionPair of event.pairs) {
            if (collisionPair.bodyA.plugin.outOfBoundsCollision) {
                collisionPair.bodyB.position = { x: -100, y: 0 };
            }

            if (collisionPair.bodyB.plugin.outOfBoundsCollision) {
                Body.setPosition(collisionPair.bodyA, {
                    x: 800 + Math.random() * 100 - 50,
                    y: -500 + Math.random() * 200 - 50,
                });

                Body.setVelocity(collisionPair.bodyA, { x: 0, y: 0 });
            }
        }
    });
};
