import {Vec2, Vec3} from 'gl-matrix';

function tosRGB( color : Vec3  ){
    const f = (x : number) => {
        if( x <= 0.0031308 ) return x * 12.92;
        else {
            return (1.0 + 0.055) * Math.pow(x, 1.0 / 2.4) - 0.055;
        }
    };
    return Vec3.fromValues( f(color[0]), f(color[1]), f(color[2]) );
}

function clampVec3(v : Vec3, min : number, max : number ){
    v[0] = Math.max( Math.min( v[0], max), min );
    v[1] = Math.max( Math.min( v[1], max), min );
    v[2] = Math.max( Math.min( v[2], max), min );
    return v;
}

function toSphericalDir( v : Vec3 ) : Vec2 {
    const phi = Math.atan2(-v.y, -v.x) + Math.PI;
    const theta = Math.acos( Math.max( Math.min(v.z, 1.0), -1.0) );
    return new Vec2(phi, theta);
}

const Constants = {
    INV_TWO_PI: 1 / ( Math.PI * 2 ),
    INV_PI: 1 / Math.PI
};

const clamp = (val:number, min:number, max:number) =>
    Math.min(Math.max(val, min), max);

/**
 * Compute the reflected direction around a surface normal.
 *
 * @param inDir the incoming direction towards the surface
 * @param n the surface normal
 * @return the reflected direction
 */
function reflect( inDir : Vec3, n : Vec3 ) : Vec3 {
    // inDir - 2 * ( in dot n ) * n
    const scale = -2 * Vec3.dot(inDir, n);
    const result = Vec3.clone(inDir);
    return result.scaleAndAdd(n, scale);
}

/**
 * Compute the refracted direction through an interface.
 * @param v_in the incoming direction (pointing towards the surface)
 * @param n the surface normal (pointing away from the surface), must be normalized
 * @param ior_ratio the ratio of the index of refraction on the incident side to the index of
 *            refraction on the transmitted side.
 * @return the refracted direction or null if refraction is not possible, i.e. there
 *         is total internal reflection.
 */
function refract(v_in : Vec3, n : Vec3, ior_ratio : number ): Vec3 | null {
    const v = Vec3.clone(v_in).normalize();

    // Check for total internal reflection
    const minusCosTheta_i = Vec3.dot(v, n);
    const d = 1.0 - ior_ratio * ior_ratio * ( 1.0 - minusCosTheta_i * minusCosTheta_i );
    if( d < 0.0 ) return null;  // Internal reflection

    // Calculate refracted direction
    // ior_ratio * ( v - n * minusCosTheta_i ) - n * sqrt(d)
    const result = Vec3.clone(v).scaleAndAdd(n, -minusCosTheta_i).scale(ior_ratio);
    result.scaleAndAdd(n, -Math.sqrt(d));
    return result;
}

/**
 * Schlick approximation for the fresnel reflectance.
 * @param cos_theta_i cosine of the incoming angle with the normal
 * @param ior_ratio the ratio of the index of refraction on the incident side to the index of
 *            refraction on the transmitted side.
 * @return the reflectance
 */
function schlickFresnel( cosTheta_i : number, ior_ratio : number ) : number {
    let r0 = (1.0 - ior_ratio) / ( 1 + ior_ratio);
    r0 = r0 * r0;
    return r0 + (1 - r0) * Math.pow((1 - cosTheta_i),5);
}

function degToRad(deg: number): number {
    return (Math.PI / 180.0) * deg;
}

export {tosRGB, clampVec3, toSphericalDir, Constants, clamp, reflect, refract, schlickFresnel, degToRad};