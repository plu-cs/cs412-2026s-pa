import {expect, test} from 'vitest';
import {Renderer} from "../src/renderer.ts";
import {Mat4, Vec3} from "gl-matrix";

test('triangle at z = 0 (world) - counter clockwise', () => {
    const r = new Renderer(500, 600);
    const near = 1;
    const far = 100;
    const persp = new Mat4().perspectiveZO(Math.PI / 2, 1, near, far);
    const m = persp.mul( Mat4.lookAt( new Mat4(), [0, 0, 5], [0,0,0], [0,1,0] ) );

    const result = r.toScreenSpace( [
        new Vec3(-2.5, 0, 0),
        new Vec3(2.5, 0, 0),
        new Vec3(0, 2.5, 0)
    ], m);
    expect(result).not.toBeUndefined();

    if( result ) {
        const z = -5;
        const depth = (far + (near * far / z)) / ( far - near );
        expect([result[0].x, result[0].y, result[0].z, result[0].w]).toEqual([
            expect.closeTo(125, 5), expect.closeTo(300, 5),
            expect.closeTo(depth, 5), expect.closeTo(1 / (-z), 5)
        ]);
        expect([result[1].x, result[1].y, result[1].z, result[1].w]).toEqual([
            expect.closeTo(375, 5), expect.closeTo(300, 5),
            expect.closeTo(depth, 5), expect.closeTo(1 / (-z), 5)
        ]);
        expect([result[2].x, result[2].y, result[2].z, result[2].w]).toEqual([
            expect.closeTo(250, 5), expect.closeTo(450, 5),
            expect.closeTo(depth, 5), expect.closeTo(1 / (-z), 5)
        ]);
    }
});

test('triangle at z = 0 (world) - clockwise, backface culling off', () => {
    const r = new Renderer(500, 600);
    r.backfaceCulling = false;
    const near = 1;
    const far = 100;
    const persp = new Mat4().perspectiveZO(Math.PI / 2, 1, near, far);
    const m = persp.mul( Mat4.lookAt( new Mat4(), [0, 0, 5], [0,0,0], [0,1,0] ) );

    const result = r.toScreenSpace( [
        new Vec3(2.5, 0, 0),
        new Vec3(-2.5, 0, 0),
        new Vec3(0, 2.5, 0)
    ], m);
    expect(result).not.toBeUndefined();

    if( result ) {
        const z = -5;
        const depth = (far + (near * far / z)) / ( far - near );
        expect([result[0].x, result[0].y, result[0].z, result[0].w]).toEqual([
            expect.closeTo(375, 5), expect.closeTo(300, 5),
            expect.closeTo(depth, 5), expect.closeTo(1 / (-z), 5)
        ]);
        expect([result[1].x, result[1].y, result[1].z, result[1].w]).toEqual([
            expect.closeTo(125, 5), expect.closeTo(300, 5),
            expect.closeTo(depth, 5), expect.closeTo(1 / (-z), 5)
        ]);
        expect([result[2].x, result[2].y, result[2].z, result[2].w]).toEqual([
            expect.closeTo(250, 5), expect.closeTo(450, 5),
            expect.closeTo(depth, 5), expect.closeTo(1 / (-z), 5)
        ]);
    }
});

test('triangle at z = 0 (world) - clockwise, backface cull', () => {
    const r = new Renderer(500, 600);
    r.backfaceCulling = true;
    const near = 1;
    const far = 100;
    const persp = new Mat4().perspectiveZO(Math.PI / 2, 1, near, far);
    const m = persp.mul( Mat4.lookAt( new Mat4(), [0, 0, 5], [0,0,0], [0,1,0] ) );

    const result = r.toScreenSpace( [
        new Vec3(2.5, 0, 0),
        new Vec3(-2.5, 0, 0),
        new Vec3(0, 2.5, 0)
    ], m);
    expect(result).toBeUndefined();

});

test('triangle with one point z < near plane - should cull', () => {
    const r = new Renderer(500, 600);
    const near = 1;
    const far = 100;
    const persp = new Mat4().perspectiveZO(Math.PI / 2, 1, near, far);
    const m = persp.mul( Mat4.lookAt( new Mat4(), [0, 0, 5], [0,0,0], [0,1,0] ) );

    const result = r.toScreenSpace( [
        new Vec3(2.5, 0, 0),
        new Vec3(-2.5, 0, 0),
        new Vec3(0, 2.5, 4.001)
    ], m);
    expect(result).toBeUndefined();
});

test('triangle with one point z close to near plane - should not cull', () => {
    const r = new Renderer(500, 600);
    const near = 1;
    const far = 100;
    const persp = new Mat4().perspectiveZO(Math.PI / 2, 1, near, far);
    const m = persp.mul( Mat4.lookAt( new Mat4(), [0, 0, 5], [0,0,0], [0,1,0] ) );

    const result = r.toScreenSpace( [
        new Vec3(-2.5, 0, 0),
        new Vec3(2.5, 0, 0),
        new Vec3(0, 2.5, 3.999)
    ], m);
    expect(result).not.toBeUndefined();

    if( result ) {
        const z = -5;
        const depth = (far + (near * far / z)) / ( far - near );
        expect([result[0].x, result[0].y, result[0].z, result[0].w]).toEqual([
            expect.closeTo(125, 5), expect.closeTo(300, 5),
            expect.closeTo(depth, 5), expect.closeTo(1 / (-z), 5)
        ]);
        expect([result[1].x, result[1].y, result[1].z, result[1].w]).toEqual([
            expect.closeTo(375, 5), expect.closeTo(300, 5),
            expect.closeTo(depth, 5), expect.closeTo(1 / (-z), 5)
        ]);
        expect([result[2].x, result[2].y, result[2].z, result[2].w]).toEqual([
            expect.closeTo(250, 5), expect.closeTo(1049.250, 2),
            expect.closeTo((far + (near * far / (-1.001))) / ( far - near ), 4), expect.closeTo(1 / 1.001, 4)
        ]);
    }
});

test('triangle with one point z > far plane - should cull', () => {
    const r = new Renderer(500, 600);
    const near = 1;
    const far = 100;
    const persp = new Mat4().perspectiveZO(Math.PI / 2, 1, near, far);
    const m = persp.mul( Mat4.lookAt( new Mat4(), [0, 0, 5], [0,0,0], [0,1,0] ) );

    const result = r.toScreenSpace( [
        new Vec3(2.5, 0, 0),
        new Vec3(-2.5, 0, -95.01),
        new Vec3(0, 2.5, 0)
    ], m);
    expect(result).toBeUndefined();
});

test('triangle with one point z close to far plane - should not cull', () => {
    const r = new Renderer(500, 600);
    const near = 1;
    const far = 100;
    const persp = new Mat4().perspectiveZO(Math.PI / 2, 1, near, far);
    const m = persp.mul( Mat4.lookAt( new Mat4(), [0, 0, 5], [0,0,0], [0,1,0] ) );

    const result = r.toScreenSpace( [
        new Vec3(-2.5, 0, 0),
        new Vec3(2.5, 0, -94.99),
        new Vec3(0, 2.5, 0)
    ], m);
    expect(result).not.toBeUndefined();

    if( result ) {
        const z = -5;
        const depth = (far + (near * far / z)) / ( far - near );
        expect([result[0].x, result[0].y, result[0].z, result[0].w]).toEqual([
            expect.closeTo(125, 5), expect.closeTo(300, 5),
            expect.closeTo(depth, 5), expect.closeTo(1 / (-z), 5)
        ]);
        expect([result[1].x, result[1].y, result[1].z, result[1].w]).toEqual([
            expect.closeTo(256.25, 2), expect.closeTo(300, 5),
            expect.closeTo((far + (near * far / (-99.99))) / ( far - near ), 4), expect.closeTo(1 / 99.99, 4)
        ]);
        expect([result[2].x, result[2].y, result[2].z, result[2].w]).toEqual([
            expect.closeTo(250, 5), expect.closeTo(450, 2),
            expect.closeTo(depth, 5), expect.closeTo(1 / (-z), 5)
        ]);
    }
});
