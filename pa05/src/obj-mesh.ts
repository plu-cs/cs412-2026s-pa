import { Box3, Vector3 } from "three";
import { PolyMesh } from "./poly-mesh";
import { QuadMesh } from "./quad-mesh";
import { TriMesh } from "./tri-mesh";

export interface ObjVertex {
    p: number,
    n: number,
    uv: number
}

export class ObjMesh {
    points: number[][];
    normals: number[][];
    uvs: number[][];
    face: ObjVertex[][];

    constructor() {
        this.points = [];
        this.normals = [];
        this.uvs = [];
        this.face = [];
    }

    centerAndScale() {
        const bbox = new Box3();
        for( let i = 0; i < this.points.length; i++ ) {
            const p = this.points[i];
            bbox.expandByPoint(new Vector3(p[0], p[1], p[2]));
        }
        const midPoint = bbox.getCenter(new Vector3());
        const bboxSize = bbox.getSize(new Vector3());
        let maxDim = bboxSize.x;
        if( maxDim < bboxSize.y ) maxDim = bboxSize.y;
        if( maxDim < bboxSize.z ) maxDim = bboxSize.z;

        const scale = 1.0 / maxDim;
        for( let i = 0; i < this.points.length; i++ ) {
            const p = this.points[i];
            p[0] = (p[0] - midPoint.x) * scale; 
            p[1] = (p[1] - midPoint.y) * scale; 
            p[2] = (p[2] - midPoint.z) * scale;
        }
    }

    asQuadMesh() : QuadMesh {
        const face = [];
        const points = this.points.map( (p) => new Vector3(p[0], p[1], p[2]) ); // copy

        for( let i = 0; i < this.face.length; i++ ) {
            let f = this.face[i];
            if( f.length !== 4 ) {
                throw new Error(`Encountered non-quadrilateral face.  (verts = ${f.length})`);
            }
            face.push(f[0].p, f[1].p, f[2].p, f[3].p);
        }

        return new QuadMesh(points, face);
    }

    asPolyMesh() : PolyMesh {
        const faces = [];
        const points = this.points.map( (p) => new Vector3(p[0], p[1], p[2]) ); // copy

        for( let i = 0; i < this.face.length; i++ ) {
            let f = this.face[i];
            faces.push( f.map( (v) => v.p ) );
        }
        return new PolyMesh(points, faces);
    }

    asTriMesh() : TriMesh {
        const face: number[] = [];
        const points : Vector3[] = [];
        const norm : Vector3[] = [];
        const hasNormals = this.normals !== null && this.normals.length > 0;
        
        const vertHash : Map<string, number> = new Map();
        const getIndex = ( v : ObjVertex ) : number => {
            let k = `${v.p}`;
            if(hasNormals) { k += `:${v.n}`; }

            let vertex = vertHash.get(k);
            if( vertex ) { return vertex; }
            else {
                const idx = points.length;
                const pt = this.points[v.p];
                points.push( new Vector3(pt[0], pt[1], pt[2]) );
                if( hasNormals ) {
                    const n = this.normals[v.n];
                    norm.push(new Vector3(n[0],n[1],n[2]));
                }
                vertHash.set(k, idx);
                return idx;
            }
        };
        for( let i = 0; i < this.face.length; i++ ) {
            const f = this.face[i];
            if( f.length !== 3 ) {
                throw new Error("Encountered non-triangle face.");
            }
            face.push(getIndex(f[0]), getIndex(f[1]), getIndex(f[2]));
        }

        if( hasNormals ) {
            return new TriMesh(points, norm, face);
        } else {
            return new TriMesh(points, null, face);
        }
    }
}
