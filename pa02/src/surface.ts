import {Ray} from "./ray.ts";
import {HitRecord} from "./hit_record.ts";

/**
 * Base class for surfaces.
 *
 * A surface represents the geometry in the scene.  A surface could be a shape
 * like a sphere or a collection of shapes like a mesh.
 */
abstract class Surface {
    abstract intersect( ray : Ray ) : HitRecord | null;
}

class Group extends Surface {

    surfaces: Surface[];

    constructor() {
        super();
        this.surfaces = [];
    }

    add(s : Surface) : void {
        this.surfaces.push(s);
    }

    intersect(ray: Ray): HitRecord | null {
        let bestHit : HitRecord | null = null;
        for( const surf of this.surfaces ) {
            const hit = surf.intersect(ray);
            if( hit ) {
                ray.maxt = hit.t;
                bestHit = hit;
            }
        }
        return bestHit;
    }
}

export {Group, Surface};