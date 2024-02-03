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

import { HEIGHT, WIDTH } from './render';

// https://github.com/liabru/matter-js/blob/master/examples/avalanche.js

export const physics = (container: HTMLCanvasElement) => {
    const engine = Engine.create();
    engine.timing.timeScale = 0.7;
    const world = engine.world;

    const render = Render.create({
        canvas: container,
        engine: engine,
        options: {
            width: WIDTH,
            height: HEIGHT,
            background: 'transparent',
            wireframeBackground: 'transparent',
            wireframes: false,
        },
    });

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);
    const stack = Composites.stack(700, -900, 10, 20, 0, 0, (x: number, y: number) => {
        return Bodies.circle(x, y, Common.random(8, 13), {
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
            // top of main tube
            Bodies.rectangle(450, 280, 800, 20, {
                isStatic: true,
                angle: Math.PI * 0.7,
            }),
            // bottom of main tube 1
            Bodies.rectangle(750, 140, 600, 20, {
                isStatic: true,
                angle: Math.PI * 0.72,
            }),
            // bottom of main tube 2
            Bodies.rectangle(500, 490, 300, 20, {
                isStatic: true,
                angle: Math.PI * 0.65,
            }),
            // bottom of main tube 3
            Bodies.rectangle(360, 690, 230, 20, {
                isStatic: true,
                angle: Math.PI * -0.25,
            }),
            // bottom of main tube 4
            Bodies.rectangle(345, 810, 170, 20, {
                isStatic: true,
                angle: Math.PI * 0.25,
            }),
            // left of main tube
            Bodies.rectangle(160, 700, 400, 20, {
                isStatic: true,
                angle: Math.PI * 0.4,
            }),
            // left lip of main funnel
            Bodies.rectangle(650, -130, 200, 20, {
                isStatic: true,
                angle: Math.PI * 0.25,
            }),
            // funnel left wall
            Bodies.rectangle(590, -430, 500, 20, {
                isStatic: true,
                angle: Math.PI * 0.5,
            }),
            // funnel right wall
            Bodies.rectangle(930, -380, 550, 20, {
                isStatic: true,
                angle: Math.PI * 0.5,
            }),
            // out of bounds hitbox
            Bodies.rectangle(340, 900, 200, 20, {
                isStatic: true,
                angle: Math.PI * 0,
                plugin: { outOfBoundsCollision: true },
            }),
            // secondary funnel left 1
            Bodies.rectangle(0, -330, 600, 20, {
                isStatic: true,
                angle: Math.PI * 0.4,
            }),

            // secondary funnel left 2
            Bodies.rectangle(30, 140, 400, 20, {
                isStatic: true,
                angle: Math.PI * -0.4,
            }),

            // secondary funnel left 3
            Bodies.rectangle(30, 400, 250, 20, {
                isStatic: true,
                angle: Math.PI * 0.3,
            }),

            // secondary funnel right 1
            Bodies.rectangle(100, -330, 600, 20, {
                isStatic: true,
                angle: Math.PI * 0.4,
            }),

            // secondary funnel right 2
            Bodies.rectangle(130, 140, 400, 20, {
                isStatic: true,
                angle: Math.PI * -0.4,
            }),

            //secondary funnel right 3
            Bodies.rectangle(130, 400, 250, 20, {
                isStatic: true,
                angle: Math.PI * 0.3,
            }),
            //secondary funnel right 4
            Bodies.rectangle(210, 540, 100, 20, {
                isStatic: true,
                angle: Math.PI * 0.5,
            }),
        ]
            // hide/show hitboxes (for dev)
            .map((p) => ((p.render.visible = false), p))
    );

    // Render.lookAt(render, Composite.allBodies(world));

    Events.on(engine, 'collisionStart', (event) => {
        for (const collisionPair of event.pairs) {
            if (collisionPair.bodyA.plugin.outOfBoundsCollision) {
                collisionPair.bodyB.position = { x: -100, y: 0 };
            }

            if (collisionPair.bodyB.plugin.outOfBoundsCollision) {
                if (Math.random() > 0.1) {
                    Body.setPosition(collisionPair.bodyA, {
                        x: 800 + Math.random() * 100 - 50,
                        y: -500 + Math.random() * 200 - 50,
                    });
                } else {
                    Body.setPosition(collisionPair.bodyA, {
                        x: 0,
                        y: -500,
                    });
                }

                Body.setVelocity(collisionPair.bodyA, { x: 0, y: 0 });
            }
        }
    });
};
