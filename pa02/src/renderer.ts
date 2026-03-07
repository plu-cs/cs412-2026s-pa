import { Scene } from "./scene";
import { Image } from "./image";
import Progress from "./progress";
import { Vec3, Vec3Like } from "gl-matrix";
import { EPSILON, Ray } from "./ray";
import { next } from "./random";
import { Lambertian } from "./materials";

export {Renderer, WhittedRenderer, PathRenderer};

abstract class Renderer {
    scene : Scene;

    constructor( scn : Scene ) {
        this.scene = scn;
    }

    abstract render() : Image;
}

class WhittedRenderer extends Renderer {

    render() : Image {
        const res = this.scene.camera.resolution;
        const image = new Image(res.x, res.y);
        const pb = new Progress(res.x * res.y);

        for (let y = 0; y < image.height; y++ ) {
            for (let x = 0; x < image.width; x++ ) {

                /*
                  TODO Task 6 - 1

                  Generate this.scene.samples rays at a random position within the pixel (x,y).  You can call the function
                  next() to get a random floating point value [0, 1).  For each ray, call this.color() to trace it.  Average the
                  results and set the pixel at (x,y) to the average color.
                */
                 
            }
            pb.inc(image.width);
        }
        pb.finished();

        return image;
    }

    color( ray : Ray ) : Vec3 {
        /*
            TODO Task 6 - 2

            To trace a ray, call this.scene.surfaces.intersect( ray ).  This returns a HitInfo object upon intersection, or null.
            Trace the provided ray.  If it intersects a lambertian surface (hit.material instanceof Lambertian), then compute the
            color as shown below, otherwise, return the background color (this.scene.background)

                For each light in this.scene.simpleLights
                    sample the light (light.sample())
                    if the sample succeeds
                         fire a shadow test ray from the hit point toward the light source, make sure to set maxt on the ray to
                         the exact position of the light source, and that mint is a small value to avoid the "shadow acne" problem 
                         (you can use the variable EPSILON in the Ray class).
                         if the shadow ray does not intersect anything, then compute the color as:
                            L * albedo * max(0, n dot wi)
                         where L is the power of the light source, albedo is a property of the material (hitInfo.material.albedo), 
                         n is the shading normal at the intersection point and wi is the direction towards the light source (from the 
                         light sample info)
                
                return the sum of the results from all light sources.
         */

        return this.scene.background;
    }

    recursiveColor( ray : Ray, depth: number ) : Vec3 {

        /*
            TODO Task 8

            The structure of this method is similar to the `color` method, with the following changes:
                - if depth is greater than or equal to 6, return (0,0,0)
                - if the material is NOT Lambertian, call scatter (hitInfo.material.scatter()), then
                  recursively call this method with the scattered ray and depth + 1.  Take the result of the recursive
                  call and multiply by the attenuation value returned by scatter and return the result.
                - otherwise (non Lambertian material), compute the color as in the `color` method 
                  (including the shadow test) and return it.

            Make sure to replace the call to `color` with a call to this method in `render()` above before
            testing.
         */

        return this.scene.background;
    }

}

class PathRenderer extends Renderer {

    render() : Image {
        const res = this.scene.camera.resolution;
        const image = new Image(res.x, res.y);

        /*
            Task 9 (optional)

            This method can be the same as the `render()` method in `WhittedRenderer`
        */


        return image;
    }

    recursiveColor( ray : Ray, depth : number ) : Vec3Like  {
        const maxDepth = 64;

        /*
            Task 9 (optional)

            Recursively raytrace the scene, by path tracing.  There are no point lights or directional
            lights (you should not use this.scene.simpleLights).  Instead objects may emit light.  The 
            ray can now bounce off of Lambertian surfaces, so all surfaces types are treated the same, 
            except for light sources.  Also, shadow test rays are no longer needed!

            Pseudo-code:
            if scene.intersect:
                get emitted color (hint: you can use hit.material->emitted)
                if depth < max_depth and material.scatter(....) is successful:
                    recursive_color = call this function recursively with the scattered ray and increased depth
                    return emitted color + attenuation * recursive_color
                else
                    return emitted color
            return background color
        */

        return this.scene.background;
    }
}