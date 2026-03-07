import {Dielectric, Lambertian, Material, Metal, Light} from "./materials.ts";

const library : Map<string, Material> = new Map<string, Material>();

function loadMaterials( j : any = {} ) : void {

    if( ! Array.isArray(j) ) throw Error("materials property must be an array");

    for( const jmat of j ) {
        if( !jmat.hasOwnProperty("type") ) throw Error("Material found without type");
        if( !jmat.hasOwnProperty("name") ) throw Error("Material found without name");
        const name = jmat["name"] as string;

        // Check for duplicates
        if( library.has(name) ) {
            throw Error(`Multiple materials found with name: ${name}`);
        }

        const type = jmat["type"] as string;
        let mat: Material = new Lambertian();
        if( type === "lambertian" ) {
            mat = new Lambertian(jmat);
        } else if( type == "metal") {
            mat = new Metal(jmat);
        } else if( type == "dielectric" ) {
            mat = new Dielectric(jmat);
        } else if( type == "light" ) {
            mat = new Light(jmat);
        } else {
            throw Error(`Unrecognized material type: ${type}`);
        }

        library.set(name, mat);
    }
}

function getMaterial(name : string) : Material {
    const value = library.get(name);
    if( value === undefined )
        throw Error(`No material named '${name}'`);
    return value;
}

export {loadMaterials, getMaterial};