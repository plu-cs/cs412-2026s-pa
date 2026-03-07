import {Group} from "./surface.ts";
import {Camera} from "./camera.ts";
import {Vec3} from "gl-matrix";
import {loadMaterials} from "./material_library.ts";
import {Sphere} from "./sphere.ts";
import {Quad} from "./quad.ts";
import {Box} from "./box.ts";
import { DirectionalLight, PointLight, SimpleLight } from "./simple_light.ts";


class Scene {

    // The objects in the scene
    readonly surfaces: Group = new Group();

    // Camera
    readonly camera : Camera = new Camera();

    // Samples per pixel
    readonly samples : number = 1;

    // Background color
    readonly background : Vec3 = new Vec3();

    // Simple lights (only used for Whitted renderer)
    readonly simpleLights : SimpleLight[] = [];

    constructor( j : any = {} ) {
        this.samples = j.num_samples ?? 1;
        this.background = j.background ? new Vec3(j.background) : new Vec3(0,0,0);

        if( !j.hasOwnProperty("camera") ) {
            throw Error("Scene must include a camera");
        }

        // Parse camera
        this.camera = new Camera(j.camera);

        // Materials
        if( j.hasOwnProperty("materials") ) loadMaterials(j["materials"]);

        // Surfaces
        if( j.hasOwnProperty("surfaces") ) {
             if( ! Array.isArray(j["surfaces"]) ) throw Error("surfaces should be an array");

             for( const jsurf of j["surfaces"] ) {
                 if( !jsurf.hasOwnProperty("type") ) throw Error("Surface found without type");
                 
                 const type = jsurf["type"] as string;
                 if( type === "sphere" ) {
                     this.surfaces.add(new Sphere(jsurf) );
                 } else if( type === "quad" ) {
                     this.surfaces.add(new Quad(jsurf) );
                 } else if ( type === "box" ) {
                     this.surfaces.add(new Box(jsurf) );
                 } else {
                     throw Error(`Surface type '${type}' not recognized`);
                 }
            }
        }

        // Simple lights
        if( j.hasOwnProperty("simple_lights") ) {
            if( ! Array.isArray(j["simple_lights"]) ) throw Error("simple_lights should be an array");

            for( const jlight of j["simple_lights"] ) {
                if( !jlight.hasOwnProperty("type") ) throw Error("Simple light found without type");
                if( !jlight.hasOwnProperty("power") ) throw Error("Simple light must have power property");

                const type = jlight["type"] as string;
                if( type === "point" ) {
                    if( !jlight.hasOwnProperty("position") ) throw Error("Point light must have position");
                    this.simpleLights.push(new PointLight(jlight.position, jlight.power) );
                } else if( type === "directional" ) {
                    if( !jlight.hasOwnProperty("direction") ) throw Error("Directional light must have direction");
                    this.simpleLights.push(new DirectionalLight(jlight.direction, jlight.power));
                } else {
                    throw Error(`SimpleLight type '${type}' not recognized`);
                }
            }
        }
    }
}

export {Scene};