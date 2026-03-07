import {Vec3, Vec3Like} from 'gl-matrix';

const EPSILON = 0.001;

class Ray {

    o : Vec3;         // The origin of the ray
    d : Vec3;         // The direction of the ray
    mint : number;    // Minimum distance along the ray segment
    maxt : number;    // Maximum distance along the ray segment

    constructor( origin : Vec3Like = new Vec3(), direction : Vec3Like = new Vec3(0,1,0),
                 mint = EPSILON, maxt = Infinity) {
        this.o = Vec3.clone(origin);
        this.d = Vec3.clone(direction);
        this.mint = mint;
        this.maxt = maxt;
    }

    /**
     * Compute the point on the ray that is a distance t from the Ray's origin
     * @param t distance along the ray
     * @return The point on the ray at the distance t
     */
    at( t : number ) : Vec3 {
        const result = new Vec3( this.o );
        return result.scaleAndAdd(this.d, t);
    }
}

export { Ray, EPSILON };
