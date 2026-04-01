import {Mesh, Vertex} from "./mesh.ts";
import {Vec2, Vec3} from "gl-matrix";

/**
 * Loads data from an obj file, and returns a promise resolving to the Mesh object.
 * 
 * @param {String} url the URL of the mesh data
 * @returns {Promise<Mesh>} promise resolving to the Mesh
 */
export async function loadObjMesh(url: string): Promise<Mesh> {

    const res = await fetch(url);
    const text = await res.text();
    let basename = url;
    const idx = url.lastIndexOf("/");
    if( idx !== -1 ) {
        basename = url.substring(idx + 1);
    }
    return parseObj(text, basename);

}

function parseObj( text: string, fileName : string ) : Mesh {
    const lines = text.split(/\r?\n/);

    // The mesh
    const mesh = new Mesh();

    for(let lineNum = 0; lineNum < lines.length; lineNum++) {
        let line = lines[lineNum];

        // Remove comments
        let commentLoc = line.indexOf("#");
        if( commentLoc >= 0 ) {
            line = line.substring(0, commentLoc);
        }
        line = line.trim();

        if( line.length > 0 ) {
            let parts = line.split(/\s+/);
            let command = parts[0];
            parts.shift();

            if (command === "v") {
                let x = parseFloat(parts[0]), y = parseFloat(parts[1]), z = parseFloat(parts[2]);
                mesh.points.push(new Vec3([x, y, z]));
            } else if (command ===  "vn") {
                mesh.normals.push( new Vec3([parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2])]) );
            } else if (command === "vt") {
                mesh.uvs.push( new Vec2([parseFloat(parts[0]), parseFloat(parts[1])]) );
            } else if (command === "f") {
                let startVert = parseVertex(parts[0], mesh);
                for (let i = 2; i < parts.length; i++) {  // Triangulate
                    mesh.verts.push(startVert);
                    let v1 = parseVertex(parts[i-1], mesh);
                    mesh.verts.push(v1);
                    let v2 = parseVertex(parts[i], mesh);
                    mesh.verts.push(v2);
                }
            }
        }
    }

    // generate normals if not provided
    if( mesh.normals.length === 0 ) {
        generateNormals(mesh);
    }

    console.log( `${fileName}: ${mesh.points.length} points, ${ mesh.normals.length } normals, ${ mesh.uvs.length} uvs, ${mesh.verts.length / 3} triangles` );
    return mesh;
}

function generateNormals(mesh : Mesh) : void {
    for(let i = 0; i < mesh.points.length; i++ ) {
        mesh.normals.push( new Vec3(0,0,0) );
    }

    for( let i = 0; i < mesh.verts.length; i += 3 ) {
        const p0 = mesh.points[mesh.verts[i].p];
        const p1 = mesh.points[mesh.verts[i+1].p];
        const p2 = mesh.points[mesh.verts[i+2].p];
        const a = Vec3.clone(p1).sub(p0);   // p1 - p0
        const b = Vec3.clone(p2).sub(p0);   // p2 - p0
        const n = new Vec3( Vec3.cross( [0,0,0], a, b ) ).normalize();  // a x b, normalized (triangle surface normal)

        mesh.verts[i].n = mesh.verts[i].p;
        mesh.verts[i+1].n = mesh.verts[i+1].p;
        mesh.verts[i+2].n = mesh.verts[i+2].p;

        mesh.normals[mesh.verts[i].n].add(n);
        mesh.normals[mesh.verts[i+1].n].add(n);
        mesh.normals[mesh.verts[i+2].n].add(n);
    }

    for( let i = 0; i < mesh.normals.length; i++ ) {
        mesh.normals[i].normalize();
    }
}

/**
 * (Private function) Parses a face vertex string.
 * 
 * @param {string} str the face vertex string
 * @param {Mesh} mesh the Mesh object
 * @returns {Vertex} contains the indices of the position, normal, and
 *       texture coordinate as properties pIdx, nIdx and tcIdx.
 */
function parseVertex(str:string, mesh : Mesh) : Vertex {
    const vertParts = str.split(/\//);
    const result : Vertex = {
        p: -1,
        n: -1,
        uv: -1
    };
    
    let pIdx = parseInt(vertParts[0]);
    if( pIdx < 0 ) pIdx = mesh.points.length + pIdx;
    else pIdx = pIdx - 1;
    result.p = pIdx;
    
    if( vertParts.length > 1 ) {
        if(vertParts[1].length > 0 ) {
            let tcIdx = parseInt(vertParts[1]);
            if(tcIdx < 0 ) tcIdx = mesh.uvs.length + tcIdx;
            else tcIdx = tcIdx - 1;
            result.uv = tcIdx;
        }
    }
    if( vertParts.length === 3 ) {
        let nIdx = parseInt(vertParts[2]);
        if( nIdx < 0 ) nIdx = mesh.normals.length + nIdx;
        else nIdx = nIdx - 1;
        result.n = nIdx;
    }

    return result;
}
