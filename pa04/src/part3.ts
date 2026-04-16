import GUI, { Controller } from 'lil-gui';
import {Texture, Scene, PerspectiveCamera, WebGLRenderer, Mesh, 
    ShaderMaterial, TextureLoader, Vector3, DataTexture, RGBAFormat, Group} from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {VertexTangentsHelper} from 'three/examples/jsm/helpers/VertexTangentsHelper.js';
import {VertexNormalsHelper} from 'three/examples/jsm/helpers/VertexNormalsHelper.js';

// @ts-ignore
import vertShader from './shader/part3.vert.glsl?raw';
// @ts-ignore
import fragShader from './shader/part3.frag.glsl?raw';

import { cube } from './shapes';

let canvas : HTMLCanvasElement;
let renderer : WebGLRenderer;
let camera : PerspectiveCamera;
let scene : Scene;

let capture = false;   // Whether or not to download an image of the canvas on the next redraw

export const controller = { init, resize };

type UniformData = { value: any };
const uniforms : Record<string,UniformData> = {
    lights: { value: [
        { color: new Vector3(1,1,1), position: new Vector3(10,10,10) },
        { color: new Vector3(1,1,1), position: new Vector3(-10,10,10) }
    ]},
    bumpiness: {value: 2.0},
    diffuseTex: { value: null },
    glossMap: {value: null},
    normalMap: {value : null},
    specularMap: {value : null}
};

type TextureData = {
    diffuse: Texture | null,
    gloss: Texture | null,
    normal: Texture | null,
    specular: Texture | null
};
const textures : Record<string, TextureData> = {
    ogre: {
        diffuse: null,
        gloss: null,
        normal: null,
        specular: null
    },
    box: {
        diffuse: null,
        gloss: null,
        normal: null,
        specular: null
    }
};

const meshes : Record<string, Group | null> = {
    ogre: null,
    box: null
};

type HelperData = {
    normalHelper: VertexNormalsHelper | null,
    tangentHelper: VertexTangentsHelper | null
};
const helpers : Record<string, HelperData> = {
    ogre: {
        normalHelper: null,
        tangentHelper: null
    },
    box: {
        normalHelper: null,
        tangentHelper: null
    }
};

const guiState = {
    mesh: 'box',
    normalsVisible: false,
    tangentsVisible: false
};

const controllers = {
    normalsController: null as Controller | null,
    tangentsController: null as Controller | null
};

function selectMesh(name: string) : void {
    if( name in meshes ) {
        Object.values(meshes).forEach( (g) => { if( g !== null) g.visible = false; } );
        if( meshes[name] ) {
            console.log( `setting to ${name}`);
            meshes[name].visible = true;
            uniforms.diffuseTex.value = textures[name].diffuse;
            uniforms.glossMap.value = textures[name].gloss;
            uniforms.normalMap.value = textures[name].normal;
            uniforms.specularMap.value = textures[name].specular;

            if( helpers[name] ) {
                const helper = helpers[name];
                if( helper.normalHelper) 
                    guiState.normalsVisible = helper.normalHelper.visible;
                if( helper.tangentHelper ) 
                    guiState.tangentsVisible = helper.tangentHelper.visible;
            }

            if( controllers.normalsController ) controllers.normalsController.updateDisplay();
            if( controllers.tangentsController ) controllers.tangentsController.updateDisplay();
        }
    }
}

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
    
    const diffTex = texLoader.load( 'data/tex/Metal_Cover_1k_d.png' );
    diffTex.flipY = false;
    textures.box.diffuse = diffTex;
    const glossTex = texLoader.load( 'data/tex/Metal_Cover_1k_g.png' );
    glossTex.flipY = false;
    textures.box.gloss = glossTex;
    const normTex = texLoader.load( 'data/tex/Metal_Cover_1k_n.png' );
    normTex.flipY = false;
    textures.box.normal = normTex;
    const specTex = texLoader.load( 'data/tex/Metal_Cover_1k_s.png' );
    specTex.flipY = false;
    textures.box.specular = specTex;

    let tex = texLoader.load( 'data/ogre/diffuse.png' );
    tex.flipY = false;
    textures.ogre.diffuse = tex;
    tex = texLoader.load( 'data/ogre/normalmap.png' );
    tex.flipY = false;
    textures.ogre.normal = tex;

    // 1x1 texture placeholders for ogre
    let data = Uint8Array.from([155,155,155,255]);
    let dataTex = new DataTexture( data, 1, 1, RGBAFormat );
    dataTex.needsUpdate = true;
    textures.ogre.gloss = dataTex;

    data = Uint8Array.from([155,155,155,255]);
    dataTex = new DataTexture( data, 1, 1, RGBAFormat );
    dataTex.needsUpdate = true;
    textures.ogre.specular = dataTex;

    const material = new ShaderMaterial({ 
        uniforms: uniforms,
        vertexShader: vertShader, 
        fragmentShader: fragShader 
    });

    const loader = new GLTFLoader().setPath( 'data/ogre/' );
    loader.load( 'ogre_smile_tangent.gltf', ( gltf ) => {
        gltf.scene.traverse( ( child ) => {
            if( child.type === 'Mesh' ) {
                const ogreGroup = new Group();

                const ogre = child as Mesh;
                ogre.material = material;
                ogreGroup.add(ogre);

                helpers.ogre.tangentHelper = new VertexTangentsHelper( ogre, 0.02 );
                helpers.ogre.tangentHelper.visible = false;
                ogreGroup.add(helpers.ogre.tangentHelper);

                helpers.ogre.normalHelper = new VertexNormalsHelper( ogre, 0.02 );
                helpers.ogre.normalHelper.visible = false;
                ogreGroup.add(helpers.ogre.normalHelper);
                
                ogreGroup.visible = false;
                meshes.ogre = ogreGroup;
                scene.add(ogreGroup);
            }
        });
    });

    const boxGroup = new Group();
    
    const box = new Mesh( cube(), material );
    boxGroup.add(box);

    helpers.box.tangentHelper = new VertexTangentsHelper( box, 0.1 );
    helpers.box.tangentHelper.visible = false;
    boxGroup.add(helpers.box.tangentHelper);

    helpers.box.normalHelper = new VertexNormalsHelper( box, 0.1 );
    helpers.box.normalHelper.visible = false;
    boxGroup.add(helpers.box.normalHelper);

    meshes.box = boxGroup;
    scene.add(boxGroup);

    selectMesh('box');

    resize();
    // Start the rendering loop.
    window.requestAnimationFrame( draw );
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
    gui.add(guiState, 'mesh', ['box', 'ogre'])
        .onFinishChange( (name : string) => selectMesh(name) );
    gui.add(uniforms.bumpiness, 'value', 0, 5).name("Bumpiness: ");
    controllers.normalsController = gui.add(guiState, 'normalsVisible').name("Show Normals:")
        .onFinishChange( (value : boolean) => {
            const helper = helpers[guiState.mesh];
            if( helper && helper.normalHelper ) {
                helper.normalHelper.visible = value;
            }
        });
    controllers.tangentsController = gui.add(guiState, 'tangentsVisible').name("Show Tangents:")
        .onFinishChange( (value : boolean) => {
            const helper = helpers[guiState.mesh];
            if( helper && helper.tangentHelper ) {
                helper.tangentHelper.visible = value;
            }
        });
    
    gui.add(buttons, 'screenshot' ).name("Capture Screenshot");
}