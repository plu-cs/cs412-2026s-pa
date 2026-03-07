import {Vec3} from "gl-matrix";
import {Lambertian, Material} from "./materials.ts";

/**
 * This class stores information about a ray-surface intersection.
 */
class HitRecord {
    t : number;           ///< Ray distance for the hit
    p : Vec3;             ///< The world-space intersection point
    gn : Vec3;            ///< The geometric normal at the intersection point
    sn : Vec3;            ///< The shading normal at the intersection point
    material : Material;  ///< The material of the intersected surface

    constructor() {
        this.t = 0.0;
        this.p = new Vec3();
        this.gn = new Vec3();
        this.sn = new Vec3();
        this.material = new Lambertian();
    }
}

export {HitRecord};