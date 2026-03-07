import {expect, test} from 'vitest';
import {mat4, vec3} from "gl-matrix";
import {Transform} from "../src/transform.ts";
import {Ray} from "../src/ray.ts";
import {compareVec3} from "./compare.ts";

test('transform point - scale', () => {
    const m = mat4.fromScaling(mat4.create(), [2, -3, 4]);
    const t = new Transform(m);
    const p = vec3.fromValues(0.8, 0.2, 1.0);
    const result = t.transformPoint(p);

    compareVec3([1.6, -0.6, 4.0], result, 5);
});

test('transform point - translate', () => {
    const m = mat4.fromTranslation(mat4.create(), [2, -3, 4]);
    const t = new Transform(m);
    const point = vec3.fromValues(1., 1., 1.);
    const result = t.transformPoint(point);

    compareVec3( [3.0, -2.0, 5.0], result, 5);
});

test('transform point - rotate', () => {
    const m = mat4.fromYRotation(mat4.create(), Math.PI / 2);
    const t = new Transform(m);
    const point = vec3.fromValues(1., 0, 0);
    const result = t.transformPoint(point);

    compareVec3( [0.0, 0.0, -1.0], result, 5);
});

test('transform vector - scale', () => {
    const m = mat4.fromScaling(mat4.create(), [2, -3, 4]);
    const t = new Transform(m);
    const vec = vec3.fromValues(0.8, 0.2, 1);
    const result = t.transformVector(vec);

    compareVec3( [1.6, -0.6, 4.0], result, 5);
});

test('transform vector - translate', () => {
    const m = mat4.fromTranslation(mat4.create(), [2, -3, 4]);
    const t = new Transform(m);
    const vec = vec3.fromValues(1, 1, 1);
    const result = t.transformVector(vec);

    compareVec3( [1, 1, 1], result, 5);
});

test('transform vector - rotate', () => {
    const m = mat4.fromYRotation(mat4.create(), Math.PI / 2);
    const t = new Transform(m);
    const vec = vec3.fromValues(1, 0, 0);
    const result = t.transformVector(vec);

    compareVec3( [0, 0, -1], result, 5);
});

test('transform normal - scale', () => {
    const m = mat4.fromScaling(mat4.create(), [1,2,1]);
    const t = new Transform(m);
    const norm = vec3.fromValues(1, 1, 0);
    const result = t.transformNormal(norm);

    compareVec3( [0.89443, 0.44721, 0.0], result, 5);
});

test('transform normal - shear', () => {
    const m = mat4.fromValues(1,0,0,0, 5,1,0,0, 0,0,1,0, 0,0,0,1);
    const t = new Transform(m);
    const norm = vec3.fromValues(0, 1, 0);
    const result = t.transformNormal(norm);

    compareVec3( [0, 1, 0], result, 5);
});

test('transform normal - shear and translate', () => {
    const m = mat4.fromValues(1,0,0,0, 5,1,0,0, 0,0,1,0, 5,6,7,1);
    const t = new Transform(m);
    const norm = vec3.fromValues(0, 1, 0);
    const result = t.transformNormal(norm);

    compareVec3( [0, 1, 0], result, 5);
});

test('transform normal - rotate', () => {
    const m = mat4.fromYRotation(mat4.create(), Math.PI / 2);
    const t = new Transform(m);
    const norm = vec3.fromValues(1, 0, 0);
    const result = t.transformNormal(norm);

    compareVec3( [0, 0, -1], result, 5);
});

test('transform ray - translation', () => {
    const m = mat4.fromTranslation(mat4.create(), [2, 4, -1]);
    const t = new Transform(m);
    const ray = new Ray([0,0,0], [0,1,0]);
    const result = t.transformRay(ray);

    compareVec3( [2, 4, -1], result.o, 5);
    compareVec3( [0,1,0], result.d, 5);
});

test('transform ray - tmin and tmax unchanged', () => {
    const m = mat4.fromTranslation(mat4.create(), [2, 4, -1]);
    const t = new Transform(m);
    const ray = new Ray([0,0,0], [0,1,0], 1, 100);
    const result = t.transformRay(ray);

    compareVec3( [2, 4, -1], result.o, 5);
    compareVec3( [0,1,0], result.d, 5);
    expect(ray.mint).toBeCloseTo(1, 5);
    expect(ray.maxt).toBeCloseTo(100, 5);
});

