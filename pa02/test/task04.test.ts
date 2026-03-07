import {expect, test} from 'vitest';
import {Camera} from '../src/camera.ts';
import {compareVec3} from "./compare.ts";

test('transform point - scale', () => {
    const camera = new Camera( {
        "vfov": 90,
        "resolution": [640, 480],
        "fdist": 1,
        "transform": {
        //    "m": [0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 3, 1, 0, 1] 
            "from": [3, 1, 0],
            "at": [0.0, 1.0, 0.0],
            "up": [0.0, 1.0, 0.0]
        }
    });

    const ray = camera.generateRay([2.5, 3.5]);

    compareVec3( [3, 1, 0], ray.o, 5);
    compareVec3( [-1, 473/480, 127/96], ray.d, 5);
});

    