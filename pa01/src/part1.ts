import GUI from 'lil-gui';
import * as Shapes from './shapes';
import {Mat4} from 'gl-matrix';
import { WireframeMesh } from './wireframe-mesh';

type Scene = {
    sphere : WireframeMesh;
    leftCube : WireframeMesh;
    rightCube : WireframeMesh;
};

// Add any module level variables here


// Called when the angle is changed in the GUI.  The angle is provided in degrees.
export function angleChanged( angle : number ) : void {
    // TODO: implement this method (replace the console.log)
    console.log(`angle changed = ${angle}`);

    controller.draw();  // Draw the scene (indirectly calls drawShapes below)
}

// Called when the scale is changed in the GUI.
export function scaleChanged( value : number ) : void {
    // TODO: implement this method (replace the console.log)
    console.log(`scale changed = ${value}`);
    controller.draw(); // Draw the scene (indirectly calls drawShapes below)
}

// Called when the mouse button is pressed down.
// x and y is the mouse position
export function mouseDown( x : number, y : number ) : void {
    // TODO: implement this method (replace console.log)
    console.log(`mouseDown: ${x} ${y}`);
}

// Called when the mouse is moved while the button is pressed down.
// x and y is the mouse position
export function mouseDrag( x : number, y : number ) : void {
    // TODO: implement this method (replace console.log)
    console.log(`mouseDrag: ${x} ${y}`);
    controller.draw();  // Draw the scene (indirectly calls drawShapes below)
}

// Do not call this method directly.  This method is called by code within the main module.
// Instead, call controller.draw(), which will clear the screen and then call this method.
export function drawShapes( ctx : CanvasRenderingContext2D, scene : Scene ) : void {
    
    // TODO: modify the code below to apply appropriate transformation matrices to each
    // object (see assignment).  For each object, set up the transformation matrix and
    // pass it to the `draw` method.  Currently, we're just passing the identity matrix.
    
    const m = Mat4.create();  // Create an identity matrix

    ctx.strokeStyle = "red";
    scene.leftCube.draw(ctx, m);
    
    ctx.strokeStyle = "blue";
    scene.rightCube.draw(ctx, m);

    ctx.strokeStyle = "black";
    scene.sphere.draw(ctx, m);
}

///////////////////////////////////////////////////////////
///////////  Do not modify the code below /////////////////
///////////////////////////////////////////////////////////

class Part1Controller {

    scene : Scene;
    guiState = {
        angle: 0.0,
        scale: 1.0
    };

    constructor() {
        this.scene = {
            sphere: Shapes.sphere(0.25, 20, 30, Mat4.create()),
            leftCube: Shapes.cube(0.4, Mat4.create().translate([-.7,0,-1]) ),
            rightCube: Shapes.cube(0.4, Mat4.create().translate([.7,0,0]))
        };
    }

    resize() : void {}

    init() : void {
        const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
        canvas.addEventListener('mousedown', (evt) => {
            const mouseX = evt.pageX - canvas.offsetLeft;
            const mouseY = evt.pageY - canvas.offsetTop;
            
            if( evt.button === 0 ) {
                document.addEventListener('mousemove', this.mouseMotion );
                document.addEventListener('mouseup', this.mouseUp);

                mouseDown(mouseX, mouseY);
            }
        });

        const gui = new GUI();
        gui.add( this.guiState, "angle", -180.0, 180.0 ).name("Cube rotation: ")
            .onChange((v : number) => angleChanged(v));
        gui.add( this.guiState, "scale", 1, 10.0 ).name("Sphere scale: ")
            .onChange((v : number) => scaleChanged(v));

        this.draw();
    }

    draw() : void {
        const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        
        if( !ctx ) return;

        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'rgb(0,0,0)';
        drawShapes(ctx, this.scene);
    }

    mouseMotion = ( evt : MouseEvent ) : void => {
        const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
        const mouseX = evt.pageX - canvas.offsetLeft;
        const mouseY = evt.pageY - canvas.offsetTop;
        mouseDrag(mouseX, mouseY);
    };

    mouseUp = ( ) : void => {
        document.removeEventListener('mousemove', this.mouseMotion);
        document.removeEventListener('mouseup', this.mouseUp);
    };
}

export const controller = new Part1Controller();
