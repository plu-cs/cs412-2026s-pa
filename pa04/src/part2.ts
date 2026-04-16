import GUI from 'lil-gui';
import {Scene, PerspectiveCamera, WebGLRenderer, Mesh, 
    ShaderMaterial, TextureLoader, Vector3} from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

// @ts-ignore
import vertShader from './shader/part2.vert.glsl?raw';
// @ts-ignore
import fragShader from './shader/part2.frag.glsl?raw';

let canvas : HTMLCanvasElement;
let renderer : WebGLRenderer;
let camera : PerspectiveCamera;
let scene : Scene;

let capture = false;   // Whether or not to download an image of the canvas on the next redraw

export const controller = {init, resize};

type UniformData = { value: any };
const uniforms : Record<string, UniformData> = {
    lights: { value: [
        { color: new Vector3(1,1,1), position: new Vector3(10,10,10) },
        { color: new Vector3(1,1,1), position: new Vector3(-10,10,10) }
    ]},
    alpha: { value: 100.0 },
    specular: { value: 1.0 },
    diffuseTex: { value: null }
};

function init() {
    setupGui();
    scene = new Scene();
    canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    camera = new PerspectiveCamera( 48, canvas.width / canvas.height, 0.1, 1000 );
    const controls = new OrbitControls(camera, canvas);
    controls.enablePan = true;
    camera.position.z = 2.5;
    renderer = new WebGLRenderer({ canvas });

    const texLoader = new TextureLoader();
    
    const diffTex = texLoader.load( 'data/ogre/diffuse.png' );
    diffTex.flipY = false;
    uniforms.diffuseTex.value = diffTex;

    const loader = new GLTFLoader().setPath( 'data/ogre/' );
    loader.load( 'ogre_smile_tangent.gltf', ( gltf ) => {
        gltf.scene.traverse( ( child ) => {
            if( child.type === 'Mesh' ) {
                const mesh = child as Mesh;
                mesh.material = new ShaderMaterial({ 
                    uniforms: uniforms,
                    vertexShader: vertShader, 
                    fragmentShader: fragShader 
                });
                scene.add(child);
            }
        });
    });

    resize();
    // Start the rendering loop.
    window.requestAnimationFrame(draw);
}

function draw() : void {
    renderer.render( scene, camera );

    if (capture) {
        capture = false;
        const image = canvas.toDataURL("image/png");
        const aEl = document.createElement('a');
        aEl.setAttribute("download", 'screen.png');
        aEl.setAttribute("href", image);
        aEl.click();
        aEl.remove();
    }
    window.requestAnimationFrame( draw );
}

function resize() {
    const container = document.getElementById('canvas-container');
    if( !container ) {
        throw new Error("Unable to get canvas-container");
    }
    
    renderer.setSize( container.clientWidth, container.clientHeight );
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
}

const buttons = {
    screenshot: () => { capture = true; }
};

function setupGui() {
    const gui = new GUI();
    gui.add(uniforms.alpha, 'value', 1, 300).name("Alpha: ");
    gui.add(uniforms.specular, 'value', 0, 1).name("Specular:");
    gui.add(buttons, 'screenshot' ).name("Capture Screenshot");
}