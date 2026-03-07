import {expect, test} from "vitest";
import {Vec3} from "gl-matrix";
import {compareVec3} from "./compare.ts";
import {Ray} from "../src/ray.ts";
import {HitRecord} from "../src/hit_record.ts";
import {Dielectric} from "../src/materials.ts";
import {degToRad} from "../src/utils.ts";

test("Entering a dielectric ior - 1.5", () => {
    const ray_d =  new Vec3(1.0, -1.0, 0.0).normalize();
    const testRay = new Ray ( new Vec3(0.0, 0.0, 0.0), ray_d );
    const hit = new HitRecord();
    hit.sn = new Vec3(0,1,0);
    hit.gn = Vec3.clone(hit.sn);

    const material = new Dielectric( {ior: 1.5} );
    hit.material = material;

    const scat = material.scatter(testRay, hit);
    expect( scat ).not.null;
    if( scat === null ) return;
    const attenuation = scat.attenuation;
    const scattered = scat.scattered;

    const sintheta_i = Math.sqrt( (1 - ray_d.y * ray_d.y) );
    const sintheta_o = Math.sqrt( (1 - scattered.d.y * scattered.d.y) );

    compareVec3(new Vec3( 0.47140455, -0.8819171, 0 ), scattered.d, 6);
    compareVec3(new Vec3(1,1,1), attenuation, 6);
    expect( sintheta_i / sintheta_o ).toBeCloseTo(1.5 / 1.0, 6);
});

test("Entering a dielectric ior - 1.3", () => {
    const ray_d =  new Vec3(1.0, -1.0, 0.0).normalize();
    const testRay = new Ray ( new Vec3(0.0, 0.0, 0.0), ray_d );
    const hit = new HitRecord();
    hit.sn = new Vec3(0,1,0);
    hit.gn = Vec3.clone(hit.sn);

    const material = new Dielectric( {ior: 1.3} );
    hit.material = material;

    const scat = material.scatter(testRay, hit);
    expect( scat ).not.null;
    if( scat === null ) return;
    const attenuation = scat.attenuation;
    const scattered = scat.scattered;

    const sintheta_i = Math.sqrt( (1 - ray_d.y * ray_d.y) );
    const sintheta_o = Math.sqrt( (1 - scattered.d.y * scattered.d.y) );

    compareVec3(new Vec3( 0.54393, -0.83913, 0.0 ), scattered.d, 5);
    compareVec3(new Vec3(1,1,1), attenuation, 6);
    expect( sintheta_i / sintheta_o ).toBeCloseTo(1.3 / 1.0, 6);
});

test("Exiting a dielectric ior - 1.5", () => {
    const ray_d =  new Vec3(0.5, -1.0, 0.0).normalize();
    const testRay = new Ray ( new Vec3(0.0, 0.0, 0.0), ray_d );
    const hit = new HitRecord();
    hit.sn = new Vec3(0,-1,0);
    hit.gn = Vec3.clone(hit.sn);

    const material = new Dielectric( {ior: 1.5} );
    hit.material = material;

    const scat = material.scatter(testRay, hit);
    expect( scat ).not.null;
    if( scat === null ) return;
    const attenuation = scat.attenuation;
    const scattered = scat.scattered;

    const sintheta_i = Math.sqrt( (1 - ray_d.y * ray_d.y) );
    const sintheta_o = Math.sqrt( (1 - scattered.d.y * scattered.d.y) );

    compareVec3(new Vec3( 0.67082, -0.74162, 0.0), scattered.d, 5);
    compareVec3(new Vec3(1,1,1), attenuation, 6);
    expect( sintheta_i / sintheta_o ).toBeCloseTo(1.0 / 1.5, 6);
});

test("Exiting a dielectric ior - 1.3", () => {
    const ray_d =  new Vec3(1.0, -1.0, 0.0).normalize();
    const testRay = new Ray ( new Vec3(0.0, 0.0, 0.0), ray_d );
    const hit = new HitRecord();
    hit.sn = new Vec3(0,-1,0);
    hit.gn = Vec3.clone(hit.sn);

    const material = new Dielectric( {ior: 1.3} );
    hit.material = material;

    const scat = material.scatter(testRay, hit);
    expect( scat ).not.null;
    if( scat === null ) return;
    const attenuation = scat.attenuation;
    const scattered = scat.scattered;

    const sintheta_i = Math.sqrt( (1 - ray_d.y * ray_d.y) );
    const sintheta_o = Math.sqrt( (1 - scattered.d.y * scattered.d.y) );

    compareVec3(new Vec3( 0.91924, -0.3937, 0.0 ), scattered.d, 5);
    compareVec3(new Vec3(1,1,1), attenuation, 6);
    expect( sintheta_i / sintheta_o ).toBeCloseTo(1.0 / 1.3, 6);
});

test( "Exiting a dielectric - total internal reflection - ior 1.5" , () => {
    const ray_d = new Vec3(1.0, -1.0, 0.0).normalize();
    const test_ray = new Ray(new Vec3(0.0, 0.0, 0.0), ray_d);
    const hit = new HitRecord();
    hit.p = new Vec3(0,0,0);
    hit.sn = new Vec3(0,-1,0);
    hit.gn = Vec3.clone(hit.sn);
    hit.material = new Dielectric( { ior: 1.5 } );

    const scat = hit.material.scatter(test_ray, hit);
    expect( scat ).null;
});

test( "Exiting a dielectric - total internal reflection - ior 1.3", () => {
    const ray_d = new Vec3(1.3, -1.0, 0.0).normalize();
    const test_ray = new Ray(new Vec3(0.0, 0.0, 0.0), ray_d);
    const hit = new HitRecord();
    hit.p = new Vec3(0,0,0);
    hit.sn = new Vec3(0,-1,0);
    hit.gn = Vec3.clone(hit.sn);
    hit.material = new Dielectric( { ior: 1.3 } );

    const scat = hit.material.scatter(test_ray, hit);
    expect( scat ).null;
});

test( "Exiting a dielectric - total internal reflection near critical angle - ior 1.333", () => {
    const theta = degToRad(48.7);
    const ray_d =  new Vec3(Math.sin(theta), -Math.cos(theta), 0.0).normalize();
    const test_ray = new Ray( new Vec3(0.0, 0.0, 0.0), ray_d);
    const hit = new HitRecord();
    hit.p = new Vec3(0,0,0);
    hit.sn = new Vec3(0,-1,0);
    hit.gn = Vec3.clone(hit.sn);
    hit.material = new Dielectric( { ior: 1.333  } );

    const scat = hit.material.scatter(test_ray, hit);
    expect( scat ).null;
});


test("Exiting a dielectric ior - 1.333 - near critical angle", () => {
    const theta = degToRad(48.5);
    const ray_d =  new Vec3(Math.sin(theta), -Math.cos(theta), 0.0).normalize();
    const test_ray = new Ray( new Vec3(0.0, 0.0, 0.0), ray_d);
    const hit = new HitRecord();
    hit.sn = new Vec3(0,-1,0);
    hit.gn = Vec3.clone(hit.sn);
    hit.material = new Dielectric( {ior: 1.333} );

    const scat = hit.material.scatter(test_ray, hit);
    expect( scat ).not.null;
    if( scat === null ) return;
    const attenuation = scat.attenuation;
    const scattered = scat.scattered;

    const sintheta_i = Math.sqrt( (1 - ray_d.y * ray_d.y) );
    const sintheta_o = Math.sqrt( (1 - scattered.d.y * scattered.d.y) );

    compareVec3([ 0.99836, -0.05728, 0.0 ], scattered.d, 5);
    compareVec3([1,1,1], attenuation, 6);
    expect( sintheta_i / sintheta_o ).toBeCloseTo(1.0 / 1.333, 6);
});