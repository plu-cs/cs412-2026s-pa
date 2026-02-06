import {GUI} from 'lil-gui';
import lineDrawings from './linedrawings.json';

/*
 * Programming assignment 0 - Warm Up
 * 
 * Implement your solution in the draw method below.  Look for a "TODO" comment
 */

// Call the main method after the DOM is loaded
window.addEventListener("DOMContentLoaded", main);

// Call resize when window is resized
window.addEventListener('resize', windowResized);

let canvas : HTMLCanvasElement | null;
let canvasContainer: HTMLElement | null;
let drawing = lineDrawings["bird"];
let selected = { drawing: "bird" };

function draw() : void {
    // Get the 2D drawing context from the canvas element
    const ctx = canvas?.getContext("2d");

    // Do nothing if ctx or canvas is missing
    if( !ctx || !canvas ) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // TODO: Implement your solution here.  The data for your line drawing is available in 
    //    the variable named drawing.  The CanvasRenderingContext2D object is in the variable ctx.  

    console.log(drawing);  // For inspecting the line data in the dev console, you can replace this line
}

function main() : void {
    // Get the canvas element
    canvas = document.querySelector('#main-canvas');

    // Get the element containing the canvas
    canvasContainer = document.querySelector('#canvas-container');

    const gui = new GUI();
    const drawingNames = Object.keys(lineDrawings);
    gui.add( selected, "drawing", drawingNames ).onFinishChange( (v : keyof typeof lineDrawings) => {
        drawing = lineDrawings[v];
        draw();
    });
    
    windowResized();
}

function windowResized() {
    if( !canvas || !canvasContainer ) return;

    // Resize the canvas to fit the container
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;
    draw();
}