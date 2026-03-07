import {Transform} from "./transform.ts";
import {Mat4, Mat4Like} from "gl-matrix";

import {degToRad} from "./utils.ts";

function parseTransform(obj: any): Transform {
    let m = new Mat4();
    if( obj instanceof Array ) {
        for( let item of obj) {
            Mat4.multiply(m, parseMatrix(item), m);
        }
    } else {
        m = new Mat4( parseMatrix(obj) );
    }
    return new Transform(m);
}

function parseMatrix(j: any) : Mat4Like {
    let m: Mat4Like | null = null;
    if( j.hasOwnProperty("translate") ) {
        m = new Mat4().translate(j["translate"]);
    } else if( j.hasOwnProperty("rotate") ) {
        const v = j["rotate"];
        m = new Mat4().rotate(degToRad(v[0]), [v[1],v[2],v[3]] );
    } else if( j.hasOwnProperty("scale") ) {
        m = new Mat4().scale(j["scale"]);
    } else if( j.hasOwnProperty("from") ) {
        const from = j["from"] ?? [0,0,1];
        const at = j["at"] ?? [0,0,0];
        const up = j["up"] ?? [0,1,0];
        m = Mat4.targetTo(Mat4.create(), from, at, up);
    } else if( j.hasOwnProperty('m') ) {
        const mat = j["m"];
        if( Array.isArray(mat) && mat.length !== 16 ) throw Error("Matrix must contain 16 elements.");
        m = new Mat4(...mat);
    }
    if( m ) return m;
    else throw Error("Invalid or unrecognized transformation");
}

export {parseTransform};