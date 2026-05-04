import GUI from 'lil-gui';
import { Group, LineBasicMaterial, LineSegments, Mesh, 
    MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { PolyMesh } from './poly-mesh';
import { ObjLoader } from './obj';
import * as Shapes from './shapes';
import * as Student from './part3';

export const controller = { init, resize };

let canvas : HTMLCanvasElement;
let scene : Scene;
let camera : PerspectiveCamera;
let renderer : WebGLRenderer;

const meshColor = '#aabbcc';
const controlMeshColor = '#ffff00';
const edgeColor = '#000000';

class MeshData {
    group: Group;
    controlMesh: PolyMesh;
    tessMesh: PolyMesh | null;
    controlMeshLines: LineSegments;
    tessMeshLines: LineSegments;
    tessMeshSolid: Mesh;

    constructor( cm : PolyMesh ) {
        this.controlMesh = cm;
        this.tessMesh = null;

        this.controlMeshLines = new LineSegments(
            this.controlMesh.asLineGeometry(),
            new LineBasicMaterial({color: controlMeshColor}));

        this.tessMeshLines = new LineSegments();
        this.tessMeshLines.material = new LineBasicMaterial({color: edgeColor});

        this.tessMeshSolid = new Mesh();
        this.tessMeshSolid.material = new MeshBasicMaterial({ 
            color: meshColor,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1 });

        this.group = new Group();
        this.group.add(this.controlMeshLines);
        this.group.add(this.tessMeshLines);
        this.group.add(this.tessMeshSolid);
    }

    subdivide( level : number ) {
        let m = this.controlMesh;
        for( let i = 0; i < level; i++ ) {
            m = Student.subdivide(m);
        }
        this.tessMesh = m;

        const lineGeom = this.tessMesh.asLineGeometry();
        this.tessMeshLines.geometry.dispose();
        this.tessMeshLines.geometry = lineGeom;

        const solidGeom = this.tessMesh.asTriangleGeometry();
        this.tessMeshSolid.geometry.dispose();
        this.tessMeshSolid.geometry = solidGeom;
    }
}

const meshData : Record<string, MeshData | null> = {
    box: null,
    bob: null,
    blub: null,
    spot: null,
    ogre: null
};

const guiState = {
    mesh: 'box',
    level: 0
};

function selectMesh() {
    if( guiState.mesh in meshData ) {
        for( const md of Object.values(meshData) ) {
            if( md ) md.group.visible = false;
        }

        const md = meshData[guiState.mesh];
        if( md ) {
            md.group.visible = true;
            subdivide(guiState.level);
        }
    }
}

function subdivide( level : number ) : void {
    const md = meshData[guiState.mesh];
    if( !md ) throw new Error("Missing mesh data");
    
    md.tessMeshLines.visible = level > 0;
    md.tessMeshSolid.visible = level > 0;

    if( level > 0 ) {
        md.subdivide(level);
    }
}

function init() {
    scene = new Scene();
    canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    camera = new PerspectiveCamera( 48, canvas.width / canvas.height, 0.1, 1000 );
    const controls = new OrbitControls(camera, canvas);
    camera.position.z = 2.0;
    renderer = new WebGLRenderer({ canvas });

    const gui = new GUI();
    gui.add( guiState, "mesh", Object.keys(meshData) )
        .onFinishChange( selectMesh );
    gui.add( guiState, "level", 0, 5, 1 ).name("Subdivision level: ")
        .onFinishChange( subdivide );

    resize();
    setupScene().then( () => {
        selectMesh();
        window.requestAnimationFrame(draw);    
    });
}

async function setupScene() {
    const pMesh = Shapes.cube(1.0);
    meshData.box = new MeshData(pMesh);
    scene.add(meshData.box.group);
    
    await ObjLoader.load('data/blub_control_mesh.obj', {triangulate: false})
        .then( (objMesh) => {
            const pMesh = objMesh.asPolyMesh();
            meshData.blub = new MeshData(pMesh);
            scene.add(meshData.blub.group);
        });
    await ObjLoader.load('data/bob_controlmesh.obj', {triangulate: false})
        .then( (objMesh) => {
            const pMesh = objMesh.asPolyMesh();
            meshData.bob = new MeshData(pMesh);
            scene.add(meshData.bob.group);
        });
    await ObjLoader.load('data/spot_control_mesh.obj', {triangulate: false})
        .then( (objMesh) => {
            const pMesh = objMesh.asPolyMesh();
            meshData.spot = new MeshData(pMesh);
            scene.add(meshData.spot.group);
        });
    await ObjLoader.load('data/ogre_controlmesh.obj', {triangulate: false})
        .then( (objMesh) => {
            const pMesh = objMesh.asPolyMesh();
            meshData.ogre = new MeshData(pMesh);
            scene.add(meshData.ogre.group);
        });
}

function draw(time : number) {
    renderer.render( scene, camera );
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