import { expect, test } from 'vitest';
import {Renderer} from "../src/renderer.ts";
import {Vec4} from "gl-matrix";

test( 'bbox completely inside 1', () => {
    const r = new Renderer(500, 600);
    const result = r.boundingBox( [
        new Vec4(45.9, 67.7, 0, 0),
        new Vec4(90, 70, 0, 0),
        new Vec4(33, 130.2, 0, 0)
    ]);
    expect( result.min ).toEqual([33,67]);
    expect( result.max ).toEqual([90,130]);
});

test( 'bbox completely inside 2', () => {
    const r = new Renderer(500, 600);
    const result = r.boundingBox( [
        new Vec4(9, 67, 0, 0),
        new Vec4(487.3, 25, 0, 0),
        new Vec4(1, 588.9, 0, 0)
    ]);
    expect( result.min ).toEqual([1,25]);
    expect( result.max ).toEqual([487,588]);
});

test( 'bbox one point outside x - 1', () => {
    const r = new Renderer(500, 600);
    const result = r.boundingBox( [
        new Vec4(9, 66, 0, 0),
        new Vec4(600, 120, 0, 0),
        new Vec4(50, 588, 0, 0)
    ]);
    expect( result.min ).toEqual([9,66]);
    expect( result.max ).toEqual([499,588]);
});

test( 'bbox one point outside x - 2', () => {
    const r = new Renderer(500, 600);
    const result = r.boundingBox( [
        new Vec4(-9, 66, 0, 0),
        new Vec4(488, 120, 0, 0),
        new Vec4(50, 588, 0, 0)
    ]);
    expect( result.min ).toEqual([0,66]);
    expect( result.max ).toEqual([488,588]);
});

test( 'bbox one point outside y - 1', () => {
    const r = new Renderer(500, 600);
    const result = r.boundingBox( [
        new Vec4(44, 66, 0, 0),
        new Vec4(488, 120, 0, 0),
        new Vec4(50, 900, 0, 0)
    ]);
    expect( result.min ).toEqual([44,66]);
    expect( result.max ).toEqual([488,599]);
});

test( 'bbox one point outside y - 2', () => {
    const r = new Renderer(500, 600);
    const result = r.boundingBox( [
        new Vec4(44, 66, 0, 0),
        new Vec4(488, -99, 0, 0),
        new Vec4(50, 500, 0, 0)
    ]);
    expect( result.min ).toEqual([44,0]);
    expect( result.max ).toEqual([488,500]);
});

test( 'bbox two points outside x - opposite sides', () => {
    const r = new Renderer(500, 600);
    const result = r.boundingBox( [
        new Vec4(-123, 66, 0, 0),
        new Vec4(800, 444, 0, 0),
        new Vec4(50, 500, 0, 0)
    ]);
    expect( result.min ).toEqual([0,66]);
    expect( result.max ).toEqual([499,500]);
});

test( 'bbox two points outside x - same side', () => {
    const r = new Renderer(500, 600);
    const result = r.boundingBox( [
        new Vec4(-123, 66, 0, 0),
        new Vec4(300, 120, 0, 0),
        new Vec4(-98, 500, 0, 0)
    ]);
    expect( result.min ).toEqual([0,66]);
    expect( result.max ).toEqual([300,500]);
});

test( 'bbox three points outside', () => {
    const r = new Renderer(500, 600);
    const result = r.boundingBox( [
        new Vec4(-123, 66, 0, 0),
        new Vec4(300.6, -120, 0, 0),
        new Vec4(120, 700, 0, 0)
    ]);
    expect( result.min ).toEqual([0,0]);
    expect( result.max ).toEqual([300,599]);
});


test( 'bbox practice exercise', () => {
    const r = new Renderer(200, 100);
    const result = r.boundingBox( [
        new Vec4(50.9, 10.9, 0, 0),
        new Vec4(150.9, 15.1, 0, 0),
        new Vec4(100, 200.1, 0, 0)
    ]);
    expect( result.min ).toEqual([ 50, 10 ]);
    expect( result.max ).toEqual([150, 99]);
});