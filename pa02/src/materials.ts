import {Vec3} from "gl-matrix";
import {Ray} from "./ray";
import {HitRecord} from "./hit_record.ts";
import {next, randomOnUnitSphere} from "./random.ts";
import {reflect, refract, schlickFresnel} from "./utils.ts";

interface ScatterInfo {
    attenuation : Vec3;   ///< Ratio of light that is absorbed by the material
    scattered : Ray;      ///< The scattered ray
}

abstract class Material {

    /**
     * Compute the scattered direction at a given hitpoint.
     *
     * @param ray the incoming ray
     * @param hit information about the intersection
     * @return ScatterInfo record if successfully scattered, null otherwise
     */
    abstract scatter(ray : Ray, hit : HitRecord ) : ScatterInfo | null;

    isEmissive() : boolean { return false; }

    // @ts-ignore
    emitted(ray : Ray, hit : HitRecord) : Vec3 {
        return new Vec3();
    }
}

class Lambertian extends Material {

    albedo: Vec3;   ///< Base reflective color (fraction of reflected light)

    constructor( j : any = {}) {
        super();
        this.albedo = j["albedo"] ?? [1,1,1];
    }

    /**
     * TODO: Task 8 (optional) 
     * 
     * Implement Lambertian scattering.  Scatter the incoming ray in a random direction and store the
     * result in the output parameter scattered.  Select the  direction by adding a random unit vector 
     * to the shading normal (available in the HitRecord object), then normalizing the result.  You can 
     * generate a random unit vector by calling the random_on_unit_sphere() function from "random.h".  
     * It is possible that the result may be close to (0,0,0).  If it is (abs. value of all three components
     * is less than about 0.001), then use a copy of the shading normal.
     * The origin of the outgoing ray should 
     * be the surface position (availble in the HitRecord), and mint/maxt should be defaults.  
     */
    scatter(ray : Ray, hit : HitRecord ) : ScatterInfo | null {
        
        return null;
    }
}

class Metal extends Material {

    albedo : Vec3;     ///< Base reflective color (fraction of reflected light)
    roughness: number; ///< Surface roughness

    constructor( j : any = {} ) {
        super();
        this.albedo = j.albedo ?? new Vec3(1,1,1);
        this.roughness = j.roughness ?? 0.0;
    }

    /**
     * TODO: Task 7  
     * 
     * Implement rough metal scattering.  Calculate the refelected direction (you may use the reflect() method
     * that is imported above).  Then add a random direction scaled by this.roughness:
     * 
     *   reflected + roughness * randomOnUnitSphere()
     * 
     * If the scattered direction is below the surface ( scatteredDir dot surface normal < 0 ), return null.
     * 
     * Return a ScatterInfo object using object-literal notation.  The attenuation should be the same as this.albedo.
     * The origin of the scattered ray should be the surface position (availble in the HitRecord), and mint/maxt should be defaults.  
     */
    scatter(ray : Ray, hit : HitRecord ) : ScatterInfo | null {

        return null;
    }

}

class Dielectric extends Material {
    ior : number;

    constructor( j : any = {} ) {
        super();
        this.ior = j.ior ?? 1.0;
    }

    /**
     * TODO: Task 7  
     * 
     * Implement dielectric scattering.  Calculate the refracted direction (you may use the refract() method
     * that is imported above).  You'll need to determine whether you are entering or exiting the object in order
     * to compute the correct iorRatio to pass to refract().  You can do so with the dot product of the ray direction
     * and the surface normal.  Make sure to pass the reversed normal if you are exiting the object.
     * The vectors that you pass to refract() must be normalized, so you should make sure that they are.
     * 
     * If the refract() method returns null, this should return null.
     * 
     * Return a ScatterInfo object using object-literal notation.  The attenuation should be (1,1,1).
     * The origin of the scattered ray should be the surface position (availble in the HitRecord), and mint/maxt should be defaults.  
     */
    scatter(ray : Ray, hit : HitRecord ) : ScatterInfo | null {
        
        return null;
    }
}


class Light extends Material {

    power : Vec3;

    constructor( j : any = {} ) {
        super();
        this.power = j.power ?? new Vec3(1,1,1);
    }

    isEmissive(): boolean { return true; }

    emitted(ray : Ray,hit: HitRecord) : Vec3 {
        // Only emit from the outward facing side
        if (Vec3.dot(ray.d, hit.sn) < 0) return Vec3.clone(this.power);
        return new Vec3(0, 0, 0);
    }

    // We do not scatter from lights
    // @ts-ignore
    scatter(ray: Ray, hit: HitRecord): ScatterInfo | null {
        return null;
    }
}

export {Lambertian, Material, Metal, Dielectric, Light};