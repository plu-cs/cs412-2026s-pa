import {controller as part1controller} from './part1';
import {controller as part2controller} from './part2';
import {controller as part3controller} from './part3';

window.addEventListener("DOMContentLoaded", main);
window.addEventListener('resize', onWindowResize, false);

type Controller = {
    draw: () => void,
    init: () => void,
    resize: () => void
};

let mainController : Controller | null;
let canvas : HTMLCanvasElement | null;

function main() {
    canvas = document.querySelector('#main-canvas');
    const hash = window.location.hash;

    const links = document.querySelector('#footer .links');
    links?.addEventListener('click', (e : Event) => { 
        e.preventDefault(); 
        const aEl : HTMLAnchorElement | null = e?.target as HTMLAnchorElement;
        window.location.href = aEl?.href;
        window.location.reload(); 
    });

    if( hash === "#p1" ) {
        mainController = part1controller;
    } else if( hash === "#p2" ) {
        mainController = part2controller;
    } else if( hash == "#p3" ) {
        mainController = part3controller;
    } else {
        mainController = part1controller;
    }
    mainController.init();
    onWindowResize();
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');

    if( ! canvas || !mainController || !container ) return;
    
    // Resize the canvas
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    mainController.resize();
    mainController.draw();
}