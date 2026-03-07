import {Vec3} from "gl-matrix";

const rng = sfc32(1234, 847828634, 29380472, 82345);

// RNG from:  https://github.com/bryc/code/blob/master/jshash/PRNGs.md
function sfc32(a:number, b:number, c:number, d:number) {
    return function():number {
        a |= 0; b |= 0; c |= 0; d |= 0;
        var t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = c << 21 | c >>> 11;
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}

function next() {
    return rng();
}

/*
 * Returns a random point uniformly sampled on the unit sphere.
 * Based on: PBRT 4th Ed, Appendix A.5.2
 * https://www.pbr-book.org/4ed/Sampling_Algorithms/Sampling_Multidimensional_Functions
 */
function randomOnUnitSphere() :Vec3 {
    const z1 = next();
    const z2 = next();

    const z = 1 - 2 * z1;
    const r = Math.sqrt(Math.max( 0.0, 1.0 - z * z) );
    const phi = 2.0 * Math.PI * z2;
    return new Vec3(r * Math.cos(phi), r * Math.sin(phi), z);
}

export {next, randomOnUnitSphere};