import { expect, test } from 'vitest';
import {Sphere} from "../src/sphere.ts";
import {Ray} from "../src/ray.ts";
import {compareVec3} from "./compare.ts";
import {vec3} from "gl-matrix";

/*
 * Task 5 - Implement the Sphere::intersect function in sphere.cpp, then
 * run the tests in this file.
 */
test( "Untransformed sphere - hit", () =>  {
    const s = new Sphere();
    const testRay = new Ray( [-0.25, 0.5, 4.0], [0.0, 0.0, -1.0] );

    // Should intersect successfully
    const hit = s.intersect(testRay);
    expect( hit ).not.null;

    const correct_t = 3.170844;
    const correct_p = vec3.fromValues(-0.25, 0.5, 0.829156);
    const correct_n = vec3.fromValues(-0.25, 0.5, 0.829156);

    if( hit !== null ) {
        expect(hit.t).toBeCloseTo(correct_t, 5);
        compareVec3(correct_p, hit.p, 5);
        compareVec3(correct_n, hit.gn, 5);
        compareVec3(correct_n, hit.sn, 5);
    }
});

test( "Untransformed sphere - miss" , () => {
    const s = new Sphere();
    const testRay = new Ray([-1.05, 0.0, 4.0], [0.0, 0.0, -1.0] );

    // Should miss
    const hit = s.intersect(testRay);
    expect( hit ).null;
});

test( "Transformed sphere - hit", () => {
    const s = new Sphere( {
        "transform": [
            { "scale": [2, 1, 0.5] },
            { "translate": [0, 0.25, 5] }
        ]
    } );

    const testRay = new Ray([1.0, 0.5, 8.0], [0.0, 0.0, -1.0]);

    // Should intersect successfully
    const hit = s.intersect(testRay);
    expect( hit ).not.null;

    const correct_t = 2.585422;
    const correct_p = vec3.fromValues(1.0, 0.5, 5.41458);
    const correct_n = vec3.fromValues(0.147442, 0.147442, 0.978019);

    if( hit !== null ) {
        expect(hit.t).toBeCloseTo(correct_t, 5);
        compareVec3(correct_p, hit.p, 5);
        compareVec3(correct_n, hit.gn, 5);
        compareVec3(correct_n, hit.sn, 5);
    }
});

test( "Transformed sphere - miss", () => {
    const s = new Sphere( {
        "transform": {"scale": [2, 1, 0.5] }
    });

    const testRay = new Ray([5.0, 0.0, 0.55], [-1.0, 0.0, 0.0]);

    // Should miss
    const hit = s.intersect(testRay);
    expect( hit ).null;
});

test( "Untransformed sphere - miss - less than mint", () => {
    const s = new Sphere();
    const testRay = new Ray([0.0, 0.0, 4], [0.0, 0.0, -1.0], 5.01);

    // Should miss
    const hit = s.intersect(testRay);
    expect( hit ).null;
});

test( "Untransformed sphere - miss - greater than maxt", () => {
    const s = new Sphere();
    const testRay = new Ray([0.0, 0.0, 4], [0.0, 0.0, -1.0], 0.001, 2.9);

    // Should miss
    const hit = s.intersect(testRay);
    expect( hit ).null;
});

test( "Untransformed sphere - hit - ray starts inside sphere -z", () => {
    const s = new Sphere();
    const testRay = new Ray( [0, 0, -0.5], [0.0, 0.0, -1.0] );

    // Should intersect successfully
    const hit = s.intersect(testRay);
    expect( hit ).not.null;

    const correct_t = 0.5;
    const correct_p = vec3.fromValues(0, 0, -1);
    const correct_n = vec3.fromValues(0, 0, -1);

    if( hit !== null ) {
        expect(hit.t).toBeCloseTo(correct_t, 5);
        compareVec3(correct_p, hit.p, 5);
        compareVec3(correct_n, hit.gn, 5);
        compareVec3(correct_n, hit.sn, 5);
    }
});

test( "Untransformed sphere - hit - ray starts inside sphere +z", () => {
    const s = new Sphere();
    const testRay = new Ray( [0, 0, 0.5], [0.0, 0.0, 1.0] );

    // Should intersect successfully
    const hit = s.intersect(testRay);
    expect( hit ).not.null;

    const correct_t = 0.5;
    const correct_p = vec3.fromValues(0, 0, 1);
    const correct_n = vec3.fromValues(0, 0, 1);

    if( hit !== null ) {
        expect(hit.t).toBeCloseTo(correct_t, 5);
        compareVec3(correct_p, hit.p, 5);
        compareVec3(correct_n, hit.gn, 5);
        compareVec3(correct_n, hit.sn, 5);
    }
});

test( "Transformed sphere - hit - ray starts inside sphere -z", () => {
    const s = new Sphere({
        "transform": { "translate": [2.0, 1.0, 3.0] }
    });
    const testRay = new Ray( [2, 1, 3], [0.0, 0.0, -1.0] );

    // Should intersect successfully
    const hit = s.intersect(testRay);
    expect( hit ).not.null;

    const correct_t = 1;
    const correct_p = vec3.fromValues(2, 1, 2);
    const correct_n = vec3.fromValues(0, 0, -1);

    if( hit !== null ) {
        expect(hit.t).toBeCloseTo(correct_t, 5);
        compareVec3(correct_p, hit.p, 5);
        compareVec3(correct_n, hit.gn, 5);
        compareVec3(correct_n, hit.sn, 5);
    }
});
