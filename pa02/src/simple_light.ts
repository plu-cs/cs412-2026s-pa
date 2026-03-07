import { Vec3, Vec3Like } from "gl-matrix";
import { HitRecord } from "./hit_record";

export {SimpleLight, PointLight, DirectionalLight};

interface SimpleLightSample {
    wi : Vec3;     // The direction towards the light source, from the surface point
    power : Vec3;  // Light source power (color) emitted along wi 
    d : number;    // distance to the light source
}

/**
 * Task 6 - Implement PointLight.sample and DirectionalLight.sample
 * 
 * Implement the sample() method in the PointLight and DirectionalLight classes.  
 */

//
// A class that represents a light source that is not associated with an object
// such as a idealized point light or directional light.
//
abstract class SimpleLight {
    power : Vec3;
    
    constructor( p : Vec3Like ) {
        this.power = Vec3.clone(p);
    }
    
    /**
     * Given a hit location, returns the direction towards this light source from the
     * location on the surface and the light source power, possibly attenuated by distance.
     */
    abstract sample( hr : HitRecord ) : SimpleLightSample;
}

class PointLight extends SimpleLight {
    position : Vec3;
    
    constructor( p: Vec3Like, pow : Vec3Like) {
        super(pow);
        this.position = Vec3.clone(p);
    }

    sample( hr : HitRecord ) : SimpleLightSample {
        /*
        TODO Task 6 - the parameter is a HitRecord representing the position of the surface point.
        Return an object of type SimpleLightSample containing the following information:
          wi - the normalized vector from the surface position to the light source
          power - the attenuated power of the light source: light source power * (1 / d^2) where d is the 
                  distance from the surface position to the light source
          d - the distance from the surface position to the light source
        
        Note that SimpleLightSample is not a class, so you need to return an object using object-literal
        notation as in the example value below.
        */

        // Replace this
        return {
            wi: new Vec3(),
            power: new Vec3(),
            d: 0.0
        };
    }
}

class DirectionalLight extends SimpleLight {

    direction : Vec3;  // Direction of rays produced by this light source
    
    constructor( d : Vec3Like, pow : Vec3Like) {
        super(pow);
        this.direction = Vec3.clone(d).normalize();
    }

    sample( hr : HitRecord ) : SimpleLightSample {

        /*
        TODO Task 6 - 
        Return an object of type SimpleLightSample containing the following information:
          wi - the direction towards the light source ( -direction )
          power - the power of the light source
          d - Infinity (directional sources do not have a position)
        
        */

        return {
            wi: new Vec3(),
            power : new Vec3(),
            d : 0
        };
    }
}