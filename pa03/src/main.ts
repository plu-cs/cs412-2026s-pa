import {Renderer, RenderMode} from "./renderer.ts";
import GUI from "lil-gui";
import {loadObjMesh} from "./objloader.ts";
import {Mesh} from "./mesh.ts";
import {OrbitController} from "./orbit.ts";
import Stats from 'stats.js';
import {loadTexture} from "./texture_load.ts";
import {ImageBuffer} from "./image_buffer.ts";
import {Mat4} from "gl-matrix";

window.addEventListener("DOMContentLoaded", main);

function main() : void {

    const canvas = document.querySelector('#main-canvas') as HTMLCanvasElement;
    let renderer: Renderer;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    const stats = new Stats();

    const guiOptions = {
        resolutionOptions: {"1024x768" : { width: 1024, height: 768 }, "800x600" : {width: 800, height: 600} },
        meshOptions: {
            "triangle" : { file: "data/mesh/triangle.obj",   mesh: null as Mesh | null, xform: undefined },
            "quad" : { file: "data/mesh/quad.obj",   mesh: null as Mesh | null, xform: undefined },
            "cube" : { file: "data/mesh/crate.obj",   mesh: null as Mesh | null, xform: undefined },
            "spot" : { file: "data/mesh/spot.obj",   mesh: null as Mesh | null, xform: new Mat4().rotateY(-Math.PI/2) },
            "bob" : { file: "data/mesh/bob_tri.obj",   mesh: null as Mesh | null, xform: new Mat4().rotateY(Math.PI/2) },
            "teapot": { file: "data/mesh/teapot.obj", mesh: null as Mesh | null,
                xform: new Mat4().translate([0,-0.8,0]).scale([0.03,0.03,0.03]) }
        },
        textureOptions: {
            "checker": { file: "data/tex/checker.png", texture : null as ImageBuffer | null},
            "spot": { file: "data/tex/spot_texture.png", texture : null as ImageBuffer | null },
            "bob": { file: "data/tex/bob_diffuse.png", texture : null as ImageBuffer | null },
            "test": { file: "data/tex/test.png", texture : null as ImageBuffer | null }
        },
        shadingOptions: {
            "wire" : RenderMode.WIRE,
            "texture only": RenderMode.TEXTURE_ONLY,
            "flat" : RenderMode.FLAT,
            "Gouraud" : RenderMode.GOURAUD,
            "Phong" : RenderMode.PHONG,
            "Phong with texture": RenderMode.PHONG_TEXTURE
        }
    };

    const guiState = {
        resolution: guiOptions.resolutionOptions["800x600"],
        meshData: guiOptions.meshOptions.spot,
        texture: guiOptions.textureOptions["checker"]
    };

    stats.dom.style.position = "absolute";
    canvas.parentElement?.appendChild(stats.dom);

    const [w,h] = [guiState.resolution.width, guiState.resolution.height];
    renderer = new Renderer(w, h);
    canvas.width = w;
    canvas.height = h;

    const gui = new GUI();
    gui.add(guiState, "resolution", guiOptions.resolutionOptions).name("Resolution")
        .onFinishChange(() => resize(guiState.resolution.width, guiState.resolution.height));
    gui.add(guiState, "meshData", guiOptions.meshOptions)
        .name("Mesh")
        .onFinishChange( () => {
            renderer.mesh = guiState.meshData.mesh;
        });
    gui.add(renderer, "renderMode", guiOptions.shadingOptions).name("Shading");
    gui.addColor(renderer.material, "ambient").name("Ambient");
    gui.addColor(renderer.material, "diffuse").name("Diffuse");
    gui.addColor(renderer.material, "specular").name("Specular");
    gui.add( renderer.material, "shininess", 2, 250, 1 ).name("Shininess");
    gui.add( guiState, "texture", guiOptions.textureOptions).name("Texture")
        .onFinishChange( () => { renderer.material.texture = guiState.texture.texture });
    gui.add(renderer, "backfaceCulling").name("Back-face culling");

    new OrbitController(renderer.camera, canvas);

    // Load meshes
    const promises = Object.values(guiOptions.meshOptions).map( (value) => {
        return loadObjMesh(value.file).then( (mesh) => {
            value.mesh = mesh;
            if( value.xform ) mesh.transform( value.xform );
        });
    });
    // Load textures
    Object.values(guiOptions.textureOptions).forEach( (value) => {
        promises.push( loadTexture(value.file).then( (texture) => {
            value.texture = texture;
        }));
    });
    Promise.all(promises).then( () => {
        renderer.mesh = guiState.meshData.mesh;
        renderer.material.texture = guiState.texture.texture;
        // Start the rendering loop.
        window.requestAnimationFrame(draw);
    });

    function draw(): void {
        stats.begin();
        renderer.render();
        stats.end();

        ctx?.putImageData(new ImageData(renderer.imageBuffer.data, renderer.imageBuffer.width, renderer.imageBuffer.height),0, 0);
        window.requestAnimationFrame(draw);
    }

    function resize( width: number, height: number) {
        canvas.width = width;
        canvas.height = height;
        renderer.resize(width, height);
    }
}