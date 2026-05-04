import { Vector3, BufferGeometry, BufferAttribute } from "three";

/**
 * Class representing a triangle mesh.
 */
export class TriMesh {

    // List of points
    points: Vector3[];
    
    // List of normal vectors
    normals: Vector3[] | null;
    
    // List of indices defining the faces - every 3 consecutive values defines a triangle
    faces: number[];

    /**
     * Constructs a TriMesh with the provided data.
     * 
     * @param p point list
     * @param n normal list
     * @param f index list
     */
    constructor( p : Vector3[], n: Vector3[] | null, f : number[] ) {
        this.points = p;
        this.normals = n;
        this.faces = f;
    }

    /**
     * Deletes the normals (if they exist), and computes averaged normal vectors.
     * The normal at each vertex is the weighted average of the face normals of all
     * faces that share that vertex.  The weight is the surface area of the triangle.
     */
    generateNormals() {

        // Delete the normal array and replace with an array of the same length
        // containing zero vectors.
        this.normals = new Array(this.points.length).fill(null);
        for( let i = 0; i < this.points.length; i++ ) {
            this.normals[i] = new Vector3();
        }

        // TODO: Part 1 - Compute the normals as the weighted average of the normals
        // of all faces that share the vertex.  Use the face area as the weight.
        // You must do this with ONE pass over the faces, followed by another pass
        // over the normals to normalize them.

        throw new Error("generateNormals is not implemented yet");  // Replace this.
    }

    /**
     * @returns this mesh as a BufferGeometry object that can be used for 
     * rendering by ThreeJS.
     */
    asTriangleGeometry() : BufferGeometry {
        if( !this.faces ) throw new Error("Missing faces");

        const pos = new Float32Array(this.points.length * 3);
        for( let i = 0; i < this.points.length; i++ ) {
            pos[i*3+0] = this.points[i].x;
            pos[i*3+1] = this.points[i].y;
            pos[i*3+2] = this.points[i].z;
        }
        let norm = null;
        if( this.normals !== null && this.normals.length > 0 ) {
            norm = new Float32Array(this.normals.length * 3);
            for( let i = 0; i < this.normals.length; i++ ) {
                norm[i*3+0] = this.normals[i].x;
                norm[i*3+1] = this.normals[i].y;
                norm[i*3+2] = this.normals[i].z;
            }
        }
        const idx = Uint32Array.from(this.faces);
        const result = new BufferGeometry();
        result.setAttribute('position', new BufferAttribute(pos,3));
        if( norm !== null ) {
            result.setAttribute('normal', new BufferAttribute(norm, 3));
        }
        result.setIndex(new BufferAttribute(idx, 1));
        return result;
    }

    /**
     * @returns the edges of this mesh as a BufferGeometry object for rendering
     * with ThreeJS.
     */
    asLineGeometry() : BufferGeometry {
        if( !this.faces ) throw new Error("Missing faces");

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
        for( let i = 0; i < this.faces.length; i+= 3) {
            for( let j = 0; j < 3; j++ ) {
                let v1 = this.faces[i+j];
                let v2 = this.faces[i+(j+1)%3];
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