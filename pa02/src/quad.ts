import {Surface} from "./surface.ts";
import {Vec2} from "gl-matrix";
import {Lambertian, Material} from "./materials.ts";
import { Transform } from "./transform.ts";
import {Ray} from "./ray.ts";
import {HitRecord} from "./hit_record.ts";
import {parseTransform} from "./json_parse.ts";
import {getMaterial} from "./material_library.ts";


/**
 * A quad defined in the x-y plane, centered at the origin with size defined by size.x and size.y.
 */
class Quad extends Surface {

    size : Vec2;
    xform : Transform;
    material : Material;

    constructor( j : any = {} ) {
        super();
        this.size = j.size ? new Vec2(j.size) : new Vec2(1,1);
        this.xform = j.transform ? parseTransform(j.transform) : new Transform();
        this.material = new Lambertian();
        if( j.hasOwnProperty("material") ) {
            this.material = getMaterial(j.material);
        }
    }

    intersect(ray: Ray): HitRecord | null {
        // Transform Ray into local space
        const xray = this.xform.inverse().transformRay(ray);

        // If z is 0.0, ray is parallel to quad's plane
        if( Math.abs(xray.d.z) < 1e-5 ) {
            return null;
        }

        // Intersection of ray and x-y plane
        const t = -xray.o.z / xray.d.z;
        if( t < xray.mint || t > xray.maxt ) return null;

        const p = xray.at(t);
        if( Math.abs(p.x) > this.size.x * 0.5 || Math.abs(p.y) > this.size.y * 0.5 ) return null;

        // We have a hit!
        const hit = new HitRecord();
        hit.p = this.xform.transformPoint(p);
        hit.t = t;
        hit.gn = hit.sn = this.xform.transformNormal([0,0,1]);
        hit.material = this.material;
        return hit;
    }

}

export {Quad};