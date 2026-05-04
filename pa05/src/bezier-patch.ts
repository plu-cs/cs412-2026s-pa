import { Vector3 } from "three";
import * as Teapot from './teapot-data';

export function simplePatch() {
    return [
        [new Vector3(-3.0,-1,3.0), new Vector3(-3.0,-1,1.0), new Vector3(-3.0,-1,-1.0), new Vector3(-3.0,-1,-3.0)],
        [new Vector3(-1.0,-1,3.0), new Vector3(-1.0, 2,1.0), new Vector3(-1.0, 2,-1.0), new Vector3(-1.0,-1,-3.0)],
        [new Vector3( 1.0,-1,3.0), new Vector3( 1.0, 2,1.0), new Vector3( 1.0, 2,-1.0), new Vector3( 1.0,-1,-3.0)],
        [new Vector3( 3.0,-1,3.0), new Vector3( 3.0,-1,1.0), new Vector3( 3.0,-1,-1.0), new Vector3( 3.0,-1,-3.0)], 
    ];
}

export function teapotPatches() : Vector3[][][] {
    let result : Vector3[][][] = [];

    Teapot.patches.forEach( (patch, index) => {
        let pts = [];
        for( let u = 0; u < 4; u++ ) {
            let vs = [];
            for( let v = 0; v < 4 ; v++ ) {
                let p = Teapot.cpdata[patch[v * 4 + u]];
                vs.push( new Vector3(p[0], p[1], p[2]) );
            }
            pts.push(vs);
        }
        result.push( pts );
        
        // Reflect y
        pts = [];
        for( let u = 3; u >= 0; u-- ) {
            let vs = [];
            for( let v = 0; v < 4 ; v++ ) {
                let p = Teapot.cpdata[patch[v * 4 + u]];
                vs.push( new Vector3(p[0], -p[1], p[2]) );
            }
            pts.push(vs);
        }
        result.push( pts );

        if( index < 6 ) {
            // Reflect x
            pts = [];
            for( let u = 3; u >= 0; u-- ) {
                let vs = [];
                for( let v = 0; v < 4 ; v++ ) {
                    let p = Teapot.cpdata[patch[v * 4 + u]];
                    vs.push( new Vector3(-p[0], p[1], p[2]) );
                }
                pts.push(vs);
            }
            result.push( pts );
            
            // Reflect x and y
            pts = [];
            for( let u = 3; u >= 0; u-- ) {
                let vs = [];
                for( let v = 3; v >= 0 ; v-- ) {
                    let p = Teapot.cpdata[patch[v * 4 + u]];
                    vs.push( new Vector3(-p[0], -p[1], p[2]) );
                }
                pts.push(vs);
            }
            result.push( pts );
        }
    });

    return result;
}