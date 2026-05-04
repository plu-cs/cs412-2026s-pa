import { Vector3 } from "three";
import { PolyMesh } from "./poly-mesh";

export function cube( size : number ) : PolyMesh {
    const sl2 = size / 2.0;
    const p = [
        // Front
        new Vector3(-sl2, -sl2, sl2), new Vector3(sl2, -sl2, sl2), new Vector3(sl2, sl2, sl2), new Vector3(-sl2, sl2, sl2),
        // Back
        new Vector3(-sl2, -sl2, -sl2), new Vector3(sl2, -sl2, -sl2), new Vector3(sl2, sl2, -sl2), new Vector3(-sl2, sl2, -sl2),
    ];
    const idx = [
        // Front face
        [0,1,2,3],
        // Right
        [1,5,6,2],
        // Left
        [4,0,3,7],
        // Back
        [5,4,7,6],
        // Top
        [3,2,6,7],
        // Bottom
        [4,5,1,0],
    ];
    
    return new PolyMesh(p, idx);
}

