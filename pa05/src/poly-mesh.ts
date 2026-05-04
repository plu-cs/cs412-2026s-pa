import { Vector3, BufferGeometry, BufferAttribute } from "three";
import { EdgeMap } from "./edge-map";

/**
 * A mesh that contains polygonal faces.
 */
export class PolyMesh {

    // The point list
    points: Vector3[];

    // The faces as indices into the point list.  Each element in this array is another
    // array defining a face.  Each face will have at least three sides, but may have more.
    faces: number[][];

    /**
     * Constructs a PolyMesh with the provided data.
     * 
     * @param points the point list
     * @param faces the faces list as a 2D jagged array.  Each element is an array defining a face.
     */
    constructor( points : Vector3[], faces : number[][] ) {
        this.points = points;
        this.faces = faces;
    }

    /**
     * @returns this mesh as a BufferGeometry object that can be used for 
     * rendering by ThreeJS.  Non-triangular faces are triangulated.
     */
    asTriangleGeometry() : BufferGeometry {
        const pos = new Float32Array(this.points.length * 3);
        for( let i = 0; i < this.points.length; i++ ) {
            pos[i*3+0] = this.points[i].x;
            pos[i*3+1] = this.points[i].y;
            pos[i*3+2] = this.points[i].z;
        }
        const idx = [];
        for( let i = 0; i < this.faces.length; i++ ) {
            const f = this.faces[i];
            const firstIdx = f[0];
            for( let j = 1; j < f.length - 1; j++ ) {
                idx.push(firstIdx, f[j], f[j+1]);
            }
        }
        return new BufferGeometry()
            .setAttribute("position", new BufferAttribute(pos, 3))
            .setIndex( idx );
    }

    /**
     * @returns the edges of this mesh as a BufferGeometry object for rendering
     * with ThreeJS.
     */
    asLineGeometry() : BufferGeometry {
        // Copy points
        const pos = new Float32Array(this.points.length * 3);
        for( let i = 0; i < this.points.length; i++ ) {
            pos[i*3+0] = this.points[i].x;
            pos[i*3+1] = this.points[i].y;
            pos[i*3+2] = this.points[i].z;
        }
        // Edges, avoiding duplicates
        const idx = [];
        const edgeSet = new EdgeMap();
        for( let i = 0; i < this.faces.length; i++) {
            const f = this.faces[i];
            for( let j = 0; j < f.length; j++ ) {
                let v1 = f[j];
                let v2 = f[(j+1) % f.length];
                if( !edgeSet.has(v1,v2) ) {
                    idx.push(v1, v2);
                    edgeSet.set(v1, v2, 1);
                }
            }
        }
        return new BufferGeometry()
            .setAttribute("position", new BufferAttribute(pos, 3))
            .setIndex(idx);
    }
}