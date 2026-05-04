import {ObjMesh, ObjVertex} from "./obj-mesh"

interface Config {
    triangulate?: boolean
}

export class ObjLoader {

    /**
     * Loads data from an obj file, and returns an ObjMesh object.
     * 
     * @param {String} text the contents of the obj file.
     * @returns {ObjMesh} the ObjMesh
     */
    static async load(url : string, config : Config = {} ) : Promise<ObjMesh> {
        config.triangulate = (config.triangulate === undefined) ? true : config.triangulate;

        const fileText = await fetch( url )
            .then((response) => {
                if( response.status === 200 ) {
                    return response.text();
                }
                const message : string = `Failed to load '${url}', response status ${response.status}`; 
                console.error(message);
                throw new Error(message);
            });

        // Split by lines
        const lines = fileText.split(/\r?\n/);

        return ObjLoader.parse( lines, config );
    }

    static parse( objText : string[], config : Config ) : ObjMesh {

        const mesh : ObjMesh = new ObjMesh();

        for(let lineNum = 0; lineNum < objText.length; lineNum++ ) {
            let line = objText[lineNum];

            // Remove line comment
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
                    let x = parseFloat(parts[0]), 
                        y = parseFloat(parts[1]), 
                        z = parseFloat(parts[2]);
                    mesh.points.push([x, y, z]);
                } else if (command ===  "vn") {
                    mesh.normals.push( [parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2])] );
                } else if (command === "vt") {
                    mesh.uvs.push( [parseFloat(parts[0]), parseFloat(parts[1])] );
                } else if (command === "f") {
                    if( config.triangulate === undefined ) throw new Error("Triangulate is undefined");
                    ObjLoader.parseFace(parts, config.triangulate, mesh);
                }
            }
        }

        return mesh;
    }

    static parseFace( faceLine : string[], tri : boolean , mesh : ObjMesh ) : void {
        const start = ObjLoader.parseVertex(faceLine[0], mesh);
        const faces : ObjVertex[][] = [];

        // Should we triangulate?
        if( tri ) {
            for (let i = 2; i < faceLine.length; i++) {
                let v1 = ObjLoader.parseVertex(faceLine[i-1], mesh);
                let v2 = ObjLoader.parseVertex(faceLine[i], mesh);
                faces.push([start, v1, v2]);
            }
        } else {
            const face : ObjVertex[] = [start];
            for( let i = 1; i < faceLine.length; i++ ) {
                face.push( ObjLoader.parseVertex(faceLine[i], mesh));
            }
            faces.push(face);
        }

        // Add faces to the mesh
        faces.forEach( (f) => mesh.face.push(f) );
    }

    /**
     * (Private function) Parses a face vertex string.
     * 
     * @param {String} str the face vertex string
     * @param {Number} nPts the number of points read so far
     * @returns {ObjVertex} contains the indices of the position, normal, and
     *       texture coordinate as properties.
     */
    static parseVertex( str : string, mesh : ObjMesh) : ObjVertex {
        const vertParts = str.split(/\//);
        const result : ObjVertex = {
            p: -1,
            n: -1,
            uv: -1
        };
        
        const pIdx = parseInt(vertParts[0]);
        result.p = ( pIdx < 0 ) ? mesh.points.length + pIdx : pIdx - 1;

        if( vertParts.length > 1 ) {
            if(vertParts[1].length > 0 ) {
                const tcIdx = parseInt(vertParts[1]);
                result.uv = (tcIdx < 0 ) ? mesh.uvs.length + tcIdx : tcIdx - 1;
            }
        }
        if( vertParts.length === 3 ) {
            let nIdx = parseInt(vertParts[2]);
            result.n = ( nIdx < 0 ) ? mesh.normals.length + nIdx : nIdx - 1;
        }

        return result;
    }

}