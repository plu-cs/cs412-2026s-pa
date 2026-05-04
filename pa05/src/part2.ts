import { CubicBezierCurve3, Vector3 } from "three";
import { QuadMesh } from "./quad-mesh";

/**
 * Produces a tessellation of a Bezier surface given a 4x4 array of control points.
 * 
 * @param controlPoints a 4x4 array of control points for the Bezier surface
 * @param level how many subdivisions to use in the u and v direction
 * @returns a QuadMesh that represents the Bezier surface based on the provided controlPoints
 * using the given tessellation level.
 */
export function tesselate( controlPoints : Vector3[][], level : number ) : QuadMesh {
    
    // TODO: Part 2 - Implement this function

    // Returns an empty QuadMesh, replace this.
    return new QuadMesh([], []);
}