import { Vector3 } from "three";
import { EdgeMap } from "./edge-map";
import { PolyMesh } from "./poly-mesh";

/**
 * Apply one level of subdivision to the given mesh, and return the result as a 
 * PolyMesh.
 * 
 * @param mesh a PolyMesh to subdivide
 * @returns a PolyMesh that is subdivided once from the original mesh, using the
 * algorithm described in the assignment.
 */
export function subdivide( mesh : PolyMesh ) : PolyMesh {

    // TODO: Part 3 - Implement this function.  You may find an EdgeMap to be helpful.
    
    // Steps:
    // (1) Linear subdivision
    // (2) Averaging
    // (3) Correction
    
    return new PolyMesh( [], [] );
}