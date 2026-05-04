import GUI from 'lil-gui';
import { BufferAttribute, BufferGeometry, Group, Line, LineBasicMaterial, LineSegments, Matrix4, Mesh, 
    MeshBasicMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { QuadMesh } from './quad-mesh';
import { simplePatch, teapotPatches } from './bezier-patch';
import { tessellate as tessellateMesh } from './part2';

export const controller = { init, resize };

let canvas : HTMLCanvasElement;
let scene : Scene;
let camera : PerspectiveCamera;
let renderer : WebGLRenderer;

const meshColor = '#aabbcc';
const controlMeshColor = '#ffff00';
const edgeColor = '#000000';

class MeshData {
    ctrlPoints: Vector3[][];
    qMesh: QuadMesh | null;
    ctrlPointsLines: LineSegments | null;
    tessMeshLines: LineSegments;
    tessMeshSolid: Mesh;

    constructor() {
        this.ctrlPoints = [];
        this.qMesh = null;
        this.ctrlPointsLines = null;
        this.tessMeshLines = new LineSegments();
        this.tessMeshLines.material = new LineBasicMaterial({color: edgeColor});
        this.tessMeshSolid = new Mesh();
        this.tessMeshSolid.material = new MeshBasicMaterial({ 
            color: meshColor,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1 });
    }

    tess( level : number ) {
        this.qMesh = tessellateMesh( this.ctrlPoints, level );
        if( !this.qMesh ) throw new Error("Missing quad mesh");

        const lineGeom = this.qMesh.asLineGeometry();
        this.tessMeshLines.geometry.dispose();
        this.tessMeshLines.geometry = lineGeom;

        const solidGeom = this.qMesh.asTriangleGeometry();
        this.tessMeshSolid.geometry.dispose();
        this.tessMeshSolid.geometry = solidGeom;
    }

    ctrlPointsToLineSegments() {
        const pts = [];
        for( let v = 0; v < 4; v++ ) {
            for( let u = 0; u < 4; u++ ) {
                const p = this.ctrlPoints[u][v];
                pts.push(p.x, p.y, p.z);
            }
        }
        const idx = [];
        for( let v = 0; v < 3; v++ ) {
            for( let u = 0; u < 3; u++ ) {
                idx.push(v*4 + u, v*4 + u + 1);
                idx.push((v+1)*4 + u, v*4 + u);
                if(v === 2) idx.push((v+1)*4 + u, (v+1)*4 + u + 1);
                if(u === 2) idx.push((v*4) + u + 1,(v+1)*4 + u + 1);
            }
        }
        const geom = new BufferGeometry();
        geom.setAttribute('position', new BufferAttribute(Float32Array.from(pts),3));
        geom.setIndex(idx);
        this.ctrlPointsLines = new LineSegments(geom, new LineBasicMaterial({color: controlMeshColor}));
    }


    transform( m : Matrix4 ) {
        for( let v = 0; v < 4; v++ ) {
            for( let u = 0; u < 4; u++ ) {
                const p = this.ctrlPoints[u][v];
                p.applyMatrix4(m);
            }
        }
    }
}

const meshData = {
    simple: new MeshData(),
    teapot: [] as MeshData[]
};

const guiState = {
    mesh: 'simple',
    level: 0
};

const groups = {
    simple: new Group(),
    teapot: new Group()
};

function selectMesh() {
    if( guiState.mesh === 'simple' ) {
        groups.simple.visible = true;
        groups.teapot.visible = false;
    } else if( guiState.mesh === 'teapot' ) {
        groups.simple.visible = false;
        groups.teapot.visible = true;
    }
    tessellate(guiState.level);
}

function tessellate( level : number ) : void {
    if( guiState.mesh === 'simple' ) {
        meshData.simple.tessMeshLines.visible = level > 0;
        meshData.simple.tessMeshSolid.visible = level > 0;
        if(level > 0) {
            meshData.simple.tess(level);
        }
    } else if( guiState.mesh === 'teapot' ) {
        meshData.teapot.forEach( (md) => {
            md.tessMeshLines.visible = level > 0;
            md.tessMeshSolid.visible = level > 0;
            if(level > 0) {
                md.tess(level);
            }
        });
    }
}

function init() {
    scene = new Scene();
    canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    camera = new PerspectiveCamera( 48, canvas.width / canvas.height, 0.1, 1000 );
    const controls = new OrbitControls(camera, canvas);
    camera.position.z = 7.0;
    renderer = new WebGLRenderer({ canvas });
    
    const gui = new GUI();
    gui.add( guiState, "mesh", ["simple", "teapot"] )
        .onFinishChange( selectMesh );
    gui.add( guiState, "level", 0, 50, 1 ).name("Tessellation level: ")
        .onFinishChange( tessellate );

    setupScene();
    selectMesh();

    resize();
    window.requestAnimationFrame(draw);
}

function setupScene() {
    meshData.simple.ctrlPoints = simplePatch();
    meshData.simple.ctrlPointsToLineSegments();
    if( !meshData.simple.ctrlPointsLines ) throw new Error("Missing control points lines");

    groups.simple.add(meshData.simple.ctrlPointsLines);
    groups.simple.add(meshData.simple.tessMeshLines);
    groups.simple.add(meshData.simple.tessMeshSolid);
    scene.add(groups.simple);

    const teapotData = teapotPatches();
    for( let i = 0; i < teapotData.length; i++ ) {
        const md = new MeshData();
        md.ctrlPoints = teapotData[i];
        meshData.teapot.push(md);
    }

    const m = new Matrix4();
        m.makeTranslation(0, -1.5, 0);
        m.multiply( new Matrix4().makeRotationX( -Math.PI / 2.0 ) );
    meshData.teapot.forEach( md => {    
        md.transform(m);
        md.ctrlPointsToLineSegments();
        if( !md.ctrlPointsLines ) throw new Error("Missing control points lines");
        groups.teapot.add(md.ctrlPointsLines);
        groups.teapot.add(md.tessMeshLines);
        groups.teapot.add(md.tessMeshSolid);
    });
    scene.add(groups.teapot);
}

function draw() {
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