import { BufferAttribute, BufferGeometry, Vector3 } from "three";

/**
 * A class representing a mesh containing only quadrilateral faces.
 */
export class QuadMesh {

    // The point list
    points: Vector3[]; 

    // The face index list - each 4 consecutive elements represents a face
    face: number[];

    /**
     * Constructs a new QuadMesh with the provided data.
     * 
     * @param points the points
     * @param faces the faces as indexes into the points array
     */
    constructor( points : Vector3[], faces : number[] ) {
        this.points = points;
        this.face = faces;
    }

    /**
     * @returns this mesh as a BufferGeometry object that can be used for 
     * rendering by ThreeJS.  Faces are triangulated.
     */
    asTriangleGeometry() : BufferGeometry {
        const pos = new Float32Array(this.points.length * 3);
        for( let i = 0; i < this.points.length; i++ ) {
            pos[i*3+0] = this.points[i].x;
            pos[i*3+1] = this.points[i].y;
            pos[i*3+2] = this.points[i].z;
        }
        const idx = [];
        for( let i = 0; i < this.face.length; i += 4 ) {
            const f = this.face;
            idx.push(f[i+0], f[i+1], f[i+2]);
            idx.push(f[i+0], f[i+2], f[i+3]);
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
        const edgeSet = new Set<string>();
        for( let i = 0; i < this.face.length; i+= 4) {
            for( let j = 0; j < 4; j++ ) {
                let v1 = this.face[i+j];
                let v2 = this.face[i+(j+1)%4];
                let k = (v1 < v2) ? `${v1}:${v2}` : `${v2}:${v1}`;
                if( !edgeSet.has(k) ) {
                    idx.push(v1, v2);
                    edgeSet.add(k);
                }
            }
        }
        return new BufferGeometry()
            .setAttribute("position", new BufferAttribute(pos, 3))
            .setIndex(idx);
    }
}