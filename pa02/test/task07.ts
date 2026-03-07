import {Vec3, Vec2} from 'gl-matrix';
import {Metal} from '../src/materials';
import { scatterTest } from './scatter_test';

console.log("-----------------------------------------------------------");
console.log("Task 7 - Scatter tests");
console.log("-----------------------------------------------------------");

scatterTest( {
    message: "Metal material (roughness 0.1)",
    imageSize: new Vec2(256,128),
    samples: 1000,
    normal: new Vec3(0.0, 0.0, 1.0).normalize(),
    material: new Metal({roughness: 0.1}),
    outFile: "img/renders/07_test_scatter_metal_smooth_01.png",
    incomingDir: new Vec3(0.0, 0.25, -1.0)
} );

scatterTest( {
    message: "Metal material (roughness 0.1)",
    imageSize: new Vec2(256,128),
    samples: 1000,
    normal: new Vec3(0.25, 0.5, 1.0).normalize(),
    material: new Metal({roughness: 0.1}),
    outFile: "img/renders/07_test_scatter_metal_smooth_02.png",
    incomingDir: new Vec3(0.0, 0.25, -1.0)
} );

scatterTest( {
    message: "Metal material (roughness 0.5)",
    imageSize: new Vec2(256,128),
    samples: 1000,
    normal: new Vec3(0.0, 0.0, 1.0).normalize(),
    material: new Metal({roughness: 0.5}),
    outFile: "img/renders/07_test_scatter_metal_rough_01.png",
    incomingDir: new Vec3(0.0, 0.25, -1.0)
} );

scatterTest( {
    message: "Metal material (roughness 0.5)",
    imageSize: new Vec2(256,128),
    samples: 1000,
    normal: new Vec3(0.25, 0.5, 1.0).normalize(),
    material: new Metal({roughness: 0.5}),
    outFile: "img/renders/07_test_scatter_metal_rough_02.png",
    incomingDir: new Vec3(0.0, 0.25, -1.0)
} );

