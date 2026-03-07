import {Transform} from "./transform.ts";
import {parseTransform} from "./json_parse.ts";
import {Ray} from "./ray.ts";
import {HitRecord} from "./hit_record.ts";
import {Vec3} from "gl-matrix";
import {Lambertian, Material} from "./materials.ts";
import {Surface} from "./surface.ts";
import {getMaterial} from "./material_library.ts";

class Sphere extends Surface {

    #radius : number = 1.0;
    #xform : Transform = new Transform();
    #material : Material;

    constructor ( json : any = {} ) {
        super();
        this.#radius = json["radius"] ?? this.#radius;
        this.#xform = json["transform"] ? parseTransform(json["transform"]) : new Transform();
        if( json.material ) {
            if ( json.material instanceof Material ) {
                this.#material = json.material;
            } else if( typeof json.material === "string" ) {
                this.#material = getMaterial(json.material);
            } else {
                throw new Error( "Material property isn't recognized: expected Material or string");
            }
        } else {
            this.#material = new Lambertian( { albedo: [1,1,1] });
        }
    }

    // TODO: Task 5 - implement Sphere::intersect
    //   Implement sphere intersection.  If the ray misses the sphere, return null.
    //   Otherwise, fill in all fields of the HitRecord (hit) and return it.
    //   Ray-Sphere intersection is covered in Chapter 6.1 - 6.3 in RIOW.  For this
    //   application, we store two normals: a shading normal and a geometric normal.
    //   For Spheres, they will both be the same.
    //   Before computing the intersection, transform the ray into the object's local
    //   system using the inverse of the transform.  In the sphere's local coordinate
    //   system it is centered at the origin.   The radius is stored in the field named
    //   radius.
    //   The values in HitRecord must be in world coordinates, so they will need to be
    //   transformed back to world coordinates before returning.  The ray's parameter (t)
    //   does not need to be transformed.
    //   If the intersection distance must be within the Ray's [mint, maxt] range, otherwise,
    //   this method should return null (and leave hit unmodified).

    intersect( ray : Ray ) : HitRecord | null {

        // TODO: Implement sphere intersection test here.
        //   If there is a successful hit, return a new HitRecord object.  Fill in all of the
        //   fields of the object (see hit_record.ts) and set material to this.#material.  Otherwise,
        //   return null.

        return null;
    }
}

export {Sphere};