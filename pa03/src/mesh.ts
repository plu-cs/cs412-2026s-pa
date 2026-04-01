import {Mat4, Vec2, Vec3, Vec4} from "gl-matrix";

interface Vertex {
    p : number;   // Index of point
    n : number;   // Index of normal vector
    uv : number;  // Index of UV
}

class Mesh {
    points : Array<Vec3>;
    normals : Array<Vec3>;
    uvs : Array<Vec2>;
    verts : Array<Vertex>;

    constructor( ) {
        this.points = [];
        this.normals = [];
        this.uvs = [];
        this.verts = [];
    }

    transform( m : Mat4 ) :void {
        this.points.forEach( p => Vec3.transformMat4(p, p, m) );
        this.normals.forEach( n => {
            const newN = Vec4.transformMat4([0,0,0,0], [n.x, n.y, n.z, 0], m);
            n.x = newN[0]; n.y = newN[1]; n.z = newN[2];
            n.normalize();
        });
    }

}


export {Mesh};
export type {Vertex};