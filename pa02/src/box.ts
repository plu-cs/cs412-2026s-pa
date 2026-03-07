import {Surface} from "./surface.ts";
import {Vec3} from "gl-matrix";
import {Lambertian, Material} from "./materials.ts";
import { Transform } from "./transform.ts";
import {Ray} from "./ray.ts";
import {HitRecord} from "./hit_record.ts";
import {parseTransform} from "./json_parse.ts";
import {getMaterial} from "./material_library.ts";


/**
 * An axis-aligned box, centered at the origin, with size defined by this.size.
 */
class Box extends Surface {

    size : Vec3;
    xform : Transform;
    material : Material;

    constructor( j : any = {} ) {
        super();
        this.size = j.size ? new Vec3(j.size) : new Vec3(1,1,1);
        this.xform = j.transform ? parseTransform(j.transform) : new Transform();
        this.material = new Lambertian();
        if( j.hasOwnProperty("material") ) {
            this.material = getMaterial(j.material);
        }
    }

    intersect(ray: Ray): HitRecord | null {
        // Transform Ray into local space
        const xray = this.xform.inverse().transformRay(ray);

        let t0 = xray.mint, t1 = xray.maxt;
        let axis = 0;
        for( let i = 0; i < 3; i++ ) {
            const invRayDir = 1 / xray.d[i];
            let tNear = (-this.size[i] * 0.5 - xray.o[i]) * invRayDir;
            let tFar = (this.size[i] * 0.5 - xray.o[i]) * invRayDir;
            if (tNear > tFar) {
                [tNear, tFar] = [tFar, tNear];
            }
            if( tNear > t0 ) {
                t0 = tNear;
                axis = i;
            }
            t1 = tFar < t1 ? tFar : t1;
            if (t0 > t1) return null;
        }

        // We have a hit!
        const p = xray.at(t0);
        const normal: [number, number, number] = [0,0,0];
        if( p[axis] < 0 ) normal[axis] = -1;
        else normal[axis] = 1;

        const hit = new HitRecord();
        hit.p = this.xform.transformPoint(p);
        hit.t = t0;
        hit.gn = hit.sn = this.xform.transformNormal(normal);
        hit.material = this.material;
        return hit;
    }

}

export {Box};