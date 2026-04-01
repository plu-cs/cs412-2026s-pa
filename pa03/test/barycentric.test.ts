import { expect, test } from 'vitest';
import {Vec4} from "gl-matrix";
import {Renderer} from "../src/renderer.ts";

test( 'barycentrics near edge ab', () => {
    const tri = [
        new Vec4(100, 10, 0, 0),
        new Vec4(100, 100, 0, 0 ),
        new Vec4(10, 10, 0, 0) ];
    const bary = Renderer.barycentric(tri, [99.9999, 55]);

    expect(bary).not.toBeUndefined();
    if( bary ) {
        const [b0,b1,b2] = bary;
        expect(b2).toBeCloseTo(0.0, 5);
        expect(b0).toBeCloseTo( 1 - (b1 + b2), 5 );
    }
});

test( 'barycentrics near edge bc', () => {
    const tri = [
        new Vec4(100, 10, 0, 0),
        new Vec4(100, 100, 0, 0 ),
        new Vec4(10, 10, 0, 0) ];
    const bary = Renderer.barycentric(tri, [55.0001, 54.9999]);

    expect(bary).not.toBeUndefined();
    if( bary ) {
        const [b0,b1,b2] = bary;
        expect(b0).toBeCloseTo(0.0, 5);
        expect(b1).toBeCloseTo( 1 - (b0 + b2), 5 );
    }
});

test( 'barycentrics near edge ca', () => {
    const tri = [
        new Vec4(100, 10, 0, 0),
        new Vec4(100, 100, 0, 0 ),
        new Vec4(10, 10, 0, 0) ];
    const bary = Renderer.barycentric(tri, [55, 10.0001]);

    expect(bary).not.toBeUndefined();
    if( bary ) {
        const [b0,b1,b2] = bary;
        expect(b1).toBeCloseTo(0.0, 5);
        expect(b2).toBeCloseTo( 1 - (b0 + b1), 5 );
    }
});

test( 'barycentrics near vertex a', () => {
    const tri = [
        new Vec4(100, 10, 0, 0),
        new Vec4(100, 100, 0, 0 ),
        new Vec4(10, 10, 0, 0) ];
    const bary = Renderer.barycentric(tri, [99.9999, 10.0001]);

    expect(bary).not.toBeUndefined();
    if( bary ) {
        const [b0,b1,b2] = bary;
        expect(b0).toBeCloseTo(1.0, 5);
        expect(b1).toBeCloseTo(0.0, 5);
        expect(b2).toBeCloseTo( 0, 5 );
    }
});

test( 'barycentrics near vertex b', () => {
    const tri = [
        new Vec4(100, 10, 0, 0),
        new Vec4(100, 100, 0, 0 ),
        new Vec4(10, 10, 0, 0) ];
    const bary = Renderer.barycentric(tri, [99.9999, 99.9999]);

    expect(bary).not.toBeUndefined();
    if( bary ) {
        const [b0,b1,b2] = bary;
        expect(b0).toBeCloseTo(0.0, 5);
        expect(b1).toBeCloseTo(1.0, 5);
        expect(b2).toBeCloseTo( 0, 5 );
    }
});

test( 'barycentrics near vertex c', () => {
    const tri = [
        new Vec4(100, 10, 0, 0),
        new Vec4(100, 100, 0, 0 ),
        new Vec4(10, 10, 0, 0) ];
    const bary = Renderer.barycentric(tri, [10.0001, 10.0001]);

    expect(bary).not.toBeUndefined();
    if( bary ) {
        const [b0,b1,b2] = bary;
        expect(b0).toBeCloseTo(0.0, 5);
        expect(b1).toBeCloseTo(0.0, 5);
        expect(b2).toBeCloseTo( 1, 5 );
    }
});

test( 'barycentrics inside triangle 1', () => {
    const tri = [
        new Vec4(-100, 0, 0, 0),
        new Vec4(100, 0, 0, 0 ),
        new Vec4(0, 100, 0, 0) ];
    const bary = Renderer.barycentric(tri, [0, 50]);

    expect(bary).not.toBeUndefined();
    if( bary ) {
        const [b0,b1,b2] = bary;
        expect(b0).toBeCloseTo(0.25, 5);
        expect(b1).toBeCloseTo(0.25, 5);
        expect(b2).toBeCloseTo( 1 - (b0 + b1), 5);
    }
});

test( 'barycentrics outside triangle 1', () => {
    const tri = [
        new Vec4(-100, 0, 0, 0),
        new Vec4(100, 0, 0, 0 ),
        new Vec4(0, 100, 0, 0) ];
    const bary = Renderer.barycentric(tri, [-101, 0]);

    expect(bary).toBeUndefined();
});

test( 'barycentrics outside triangle 2', () => {
    const tri = [
        new Vec4(-100, 0, 0, 0),
        new Vec4(100, 0, 0, 0 ),
        new Vec4(0, 100, 0, 0) ];
    const bary = Renderer.barycentric(tri, [101, 0]);

    expect(bary).toBeUndefined();
});

test( 'barycentrics outside triangle 3', () => {
    const tri = [
        new Vec4(100, 0, 0, 0),
        new Vec4(100, 100, 0, 0 ),
        new Vec4(0, 0, 0, 0) ];
    const bary = Renderer.barycentric(tri, [55, 56]);

    expect(bary).toBeUndefined();
});

test( 'barycentrics outside triangle 4', () => {
    const tri = [
        new Vec4(100, 0, 0, 0),
        new Vec4(100, 100, 0, 0 ),
        new Vec4(0, 0, 0, 0) ];
    const bary = Renderer.barycentric(tri, [54, 55]);

    expect(bary).toBeUndefined();
});

test( 'barycentrics inside triangle 1 - CW', () => {
    const tri = [
        new Vec4(0, 0, 0, 0),
        new Vec4(50, 100, 0, 0 ),
        new Vec4(100, 0, 0, 0) ];
    const bary = Renderer.barycentric(tri, [50, 50]);

    expect(bary).not.toBeUndefined();
    if( bary ) {
        const [b0,b1,b2] = bary;
        expect(b0).toBeCloseTo(0.25, 5);
        expect(b1).toBeCloseTo(0.5, 5);
        expect(b2).toBeCloseTo( 1 - (b0 + b1), 5);
    }
});

test( 'practice exercise - CCW', () => {
    const tri = [
        new Vec4(50.9, 10.9, 0, 0),
        new Vec4(150.9, 15.1, 0, 0 ),
        new Vec4(100, 200.1, 0, 0) ];
    const bary = Renderer.barycentric(tri, [100, 50]);

    expect(bary).not.toBeUndefined();
    if( bary ) {
        const [b0,b1,b2] = bary;
        expect(b0).toBeCloseTo(0.40826, 5);
        expect(b1).toBeCloseTo(0.3938226, 5);
        expect(b2).toBeCloseTo( 1 - (b0 + b1), 5);
    }
});