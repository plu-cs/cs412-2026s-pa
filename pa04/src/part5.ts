import GUI from 'lil-gui';
import {Texture, Scene, PerspectiveCamera, WebGLRenderer, Mesh, 
    ShaderMaterial, TextureLoader, Vector3, CubeTextureLoader} from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

// @ts-ignore
import vertShader from './shader/part5.vert.glsl?raw';
// @ts-ignore
import fragShader from './shader/part5.frag.glsl?raw';

import { cube } from './shapes';

let canvas : HTMLCanvasElement;
let renderer : WebGLRenderer;
let camera : PerspectiveCamera;
let scene : Scene;

let capture = false;   // Whether or not to download an image of the canvas on the next redraw

export const controller = { init, resize };

const guiState = { mesh: 'cube' };

type UniformData = { value: any };
const uniforms : Record<string,UniformData> = {
    lights: { value: [
        { color: new Vector3(1,1,1), position: new Vector3(10,10,10) },
        { color: new Vector3(1,1,1), position: new Vector3(-10,10,10) }
    ]},
    cubeTex: { value: null }
};

const meshes : Record<string, Mesh | null> = {
    cube: null,
    ogre: null
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

    const texLoader = new CubeTextureLoader();
    
    const cubeTex = texLoader.load([
        'data/tex/cube/posx.jpg',
        'data/tex/cube/negx.jpg',
        'data/tex/cube/posy.jpg',
        'data/tex/cube/negy.jpg',
        'data/tex/cube/posz.jpg',
        'data/tex/cube/negz.jpg'
    ]);
    cubeTex.flipY = false;
    uniforms.cubeTex.value = cubeTex;
    scene.background = cubeTex;

    const material = new ShaderMaterial({ 
        uniforms: uniforms,
        vertexShader: vertShader, 
        fragmentShader: fragShader 
    });

    const cubeGeom = cube();
    meshes.cube = new Mesh(cubeGeom,material);
    scene.add(meshes.cube);
    meshes.cube.visible = false;

    const loader = new GLTFLoader().setPath( 'data/ogre/' );
    loader.load( 'ogre_smile_tangent.gltf', ( gltf ) => {
        gltf.scene.traverse( ( child ) => {
            if( child.type === 'Mesh' ) {
                meshes.ogre = child as Mesh;
                meshes.ogre.material = material;
                meshes.ogre.visible = false;
                scene.add(child);
            }
        });
        showMesh();
    });

    resize();
    window.requestAnimationFrame(draw);
}

function showMesh() {
    const name = guiState.mesh;
    if( name in meshes ) {
        Object.entries(meshes).forEach( ([n,msh]) => { if(msh) msh.visible = (n === name);});
    }
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
    gui.add( guiState, 'mesh', ['ogre', 'cube']).name("Mesh: ").onFinishChange( showMesh );
    gui.add(buttons, 'screenshot' ).name("Capture Screenshot");
}