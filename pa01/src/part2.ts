import GUI from 'lil-gui';
import * as Shapes from './shapes';
import { WireframeMesh } from './wireframe-mesh';
import {Mat4} from 'gl-matrix';

// TODO - Part 2 - Implement these methods as described in the assignment.

type Scene = {
    sphere1: WireframeMesh,
    sphere2: WireframeMesh,
    cylinder: WireframeMesh
}

// Declare module level variables here


// Called when the angle is changed in the GUI.  angle is provided in degrees.
export function redSphereAngleChanged( angle : number ) : void {

    controller.draw();
}   

// Called when the green sphere's angle is changed in the GUI.  angle is in degrees.
export function greenSphereAngleChanged( angle : number ) : void {

    controller.draw();
}   

// Called when the cylinder's scale is changed in the GUI.
export function cylinderScaleChanged( value : number ) : void {

    controller.draw();
}

// Do not call this method directly.  This method is called by code within the main module.
// Instead, call controller.draw(), which will clear the screen and then call this method.
export function drawShapes( ctx : CanvasRenderingContext2D, scene : Scene ) : void {
    const m = Mat4.create();
    
    ctx.strokeStyle = "red";
    scene.sphere1.draw(ctx, m);

    ctx.strokeStyle = "green";
    scene.sphere2.draw(ctx, m);
    
    ctx.strokeStyle = "blue";
    scene.cylinder.draw(ctx, m);
}

///////////////////////////////////////////////////////////
///////////  Do not modify the code below /////////////////
///////////////////////////////////////////////////////////

class Part2Controller {

    scene : Scene;

    guiState = {
        redSphereAngle: 0.0,
        greenSphereAngle: 0.0,
        cylinderScale: 1.0
    };

    constructor() {
        const m = Mat4.create();
        Mat4.translate(m, m, [-0.5,0.5,0]);
        const sphere1 = Shapes.sphere(0.25, 20, 30, m);

        m.identity();
        Mat4.translate(m, m, [0.1,-0.3,0]);
        const sphere2 = Shapes.sphere(0.05, 12, 12, m);

        m.identity();
        Mat4.translate(m, m, [.5,0,0]);
        Mat4.rotateZ(m, m, 45.0 * Math.PI / 180.0);
        Mat4.scale(m, m, [1,0.75,1]);
        Mat4.translate(m, m, [0,-0.5,0]);
        const cylinder = Shapes.cylinder(0.15, 30, 30, m);

        this.scene = {
            sphere1, sphere2, cylinder
        };
    }

    init() {
        const gui = new GUI();
        gui.add( this.guiState, "redSphereAngle", -180.0, 180.0 ).name("Red sphere rotation: ")
            .onChange((v : number) => redSphereAngleChanged(v));
        gui.add( this.guiState, "greenSphereAngle", -180.0, 180.0 ).name("Green sphere rotation: ")
            .onChange((v : number) => greenSphereAngleChanged(v));
        gui.add( this.guiState, "cylinderScale", 0.5, 10.0 ).name("Cylinder scale: ")
            .onChange((v : number) => cylinderScaleChanged(v));

        this.draw();
    }

    draw() {
        const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if(!ctx) throw new Error("Unable to get 2D context");
        
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'rgb(0,0,0)';
        drawShapes(ctx, this.scene);
    }

    resize() {}
}

export const controller = new Part2Controller();
