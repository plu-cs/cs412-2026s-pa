import {Vec3, Vec2} from 'gl-matrix';
import {Lambertian} from '../src/materials';
import { scatterTest } from './scatter_test';

console.log("-----------------------------------------------------------");
console.log("Task 9 - Scatter tests");
console.log("-----------------------------------------------------------");

scatterTest({
    message: "Lambertian material",
    imageSize: new Vec2(256,128),
    samples: 1000,
    normal: new Vec3(0,0,1),
    material: new Lambertian(),
    outFile: "img/renders/06_test_scatter_lambertian_01.png",
    incomingDir: new Vec3(0.0, 0.25, -1.0)
});

scatterTest( {
    message: "Lambertian material",
    imageSize: new Vec2(256,128),
    samples: 1000,
    normal: new Vec3(0.25, 0.5, 1.0).normalize(),
    material: new Lambertian(),
    outFile: "img/renders/06_test_scatter_lambertian_02.png",
    incomingDir: new Vec3(0.0, 0.25, -1.0)
} );

