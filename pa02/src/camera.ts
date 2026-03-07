import {Vec2, Vec2Like, Vec3} from "gl-matrix";
import {Ray} from "./ray.ts";
import {Transform} from "./transform.ts";
import {parseTransform} from "./json_parse.ts";
import {degToRad} from "./utils.ts";

class Camera {

    #xform : Transform;                  ///< Transform to world coordinates
    #imagePlaneSize : [number, number]; ///< Dimensions of the image plane
    #resolution : [number, number] = [512, 512]; ///< Resolution of the image
    #focalDist = 1.0;          ///< Focal distance (distance to image plane from the origin)
    #vfov : number = degToRad(80.0); /// Vertical field of view angle (in radians)
    #pixelUpperLeft : Vec3;    /// Position of the upper left corner of the pixel grid
    #pixelU : Vec3;            // vector pointing in the x direction (camera coords.) length of one pixel
    #pixelV : Vec3;            // vector pointing in the -y direction (camera coords.) length of one pixel

    constructor( settings : any = {} ) {
        this.#resolution = settings.resolution ?? this.#resolution;
        this.#focalDist  = settings.focalDist ?? this.#focalDist;
        this.#vfov       = settings.vfov ? degToRad(settings.vfov) : this.#vfov;
        this.#xform      = settings.transform ? parseTransform(settings.transform) : new Transform();

        // TODO: Task 2 - Compute the dimensions (width and height)
        //   of the image plane based on the focal distance (this.#focalDist) and field of view angle (this.#vfov).
        //   Store the dimensions in the instance variable named imagePlaneSize.
        //   Note that the aspect ratio can be determined from the variable this.#resolution.
        

    }
    /**
     * Generate a camera ray.
     *
     * @param sample the position on the image plane in pixel coordinates
     * @return a ray that originates at the camera's position and passes
     *         through the image plane at sample
     */
    generateRay( sample : Vec2Like ) : Ray {
        // TODO: Task 2 - Given the location on the image plane in pixel coordinates,
        //   compute and return the camera ray that starts at the camera's location
        //   and passes through the sample position on the image plane.

        // TODO: Task 4 - Update so that the ray is transformed into world coordinates
        //   before it is returned.

        return new Ray();  // Replace this
    }

    get resolution(): Vec2 { return Vec2.clone(this.#resolution); }

}

export {Camera};