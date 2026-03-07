import {Vec3} from "gl-matrix";
import {clamp} from "../src/utils.ts";

const inferno_map_hex = [
    "#010005", "#1c0f4b", "#520d8e", "#881b9e", "#bc2e9a",
    "#f04188", "#ff5c6a", "#ff8345", "#ffb71b", "#fff415",
    "#ffff64", "#ffffe1", "#ffffeb"];

const cMap = inferno_map_hex.map( (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) { return new Vec3(); }
    return new Vec3(
        parseInt(result[1], 16) / 255.0,
        parseInt(result[2], 16) / 255.0,
        parseInt(result[3], 16) / 255.0
    );
});

function colorMap( val : number ): Vec3 {
    const value = clamp( val, 0, 1);
    const index = clamp( Math.floor( value * (cMap.length + 1) ), 0, cMap.length - 1 );
    return Vec3.clone(cMap[ index ]);
}

export {colorMap};