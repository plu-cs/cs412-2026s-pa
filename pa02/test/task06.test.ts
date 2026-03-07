import { expect, test } from 'vitest';
import { DirectionalLight, PointLight } from '../src/simple_light.ts';
import { HitRecord } from '../src/hit_record.ts';
import { Vec3 } from 'gl-matrix';
import { compareVec3 } from './compare.ts';

/*
 * Task 6 - Implement PointLight.sample() and DirectionalLight.sample() in src/simple_light.ts 
 *          Then run these tests.
 */
test( "point light - sample test 1", () =>  {
    const light = new PointLight( [0,10,0], [1,1,1] );
    
    const hr = new HitRecord();
    hr.p = new Vec3(0,5,0);

    const sample = light.sample(hr);

    compareVec3(new Vec3( 0, 10 - 5, 0).normalize(), sample.wi, 6);
    compareVec3(new Vec3(1 / 25), sample.power, 6);
    expect( sample.d ).toBeCloseTo(5, 6);
});

test( "point light - sample test 2", () =>  {
    const light = new PointLight( [1,-2,1], [2,2,5] );
    
    const hr = new HitRecord();
    hr.p = new Vec3(1,0,1);

    const sample = light.sample(hr);

    compareVec3(new Vec3(0, -2, 0).normalize(), sample.wi, 6);
    compareVec3(new Vec3(2 / 4, 2/4, 5/4), sample.power, 6);
    expect( sample.d ).toBeCloseTo(2, 6);
});

test( "directional light - sample test 1", () =>  {
    const light = new DirectionalLight( [0,10,0], [2,2,4] );
    
    const hr = new HitRecord();
    hr.p = new Vec3(1,0,1);

    const sample = light.sample(hr);

    compareVec3(new Vec3(0, -10, 0).normalize(), sample.wi, 6);
    compareVec3(new Vec3(2, 2, 4), sample.power, 6);
    expect( sample.d ).toEqual( Infinity );
});

test( "directional light - sample test 2", () =>  {
    const light = new DirectionalLight( [1,-1,5], [10,10,10] );
    
    const hr = new HitRecord();
    hr.p = new Vec3(1,0,1);

    const sample = light.sample(hr);

    compareVec3(new Vec3(-1, 1, -5).normalize(), sample.wi, 6);
    compareVec3(new Vec3(10, 10, 10), sample.power, 6);
    expect( sample.d ).toEqual( Infinity );
});