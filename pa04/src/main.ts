import {controller as part1controller} from './part1';
import {controller as part2controller} from './part2';
import {controller as part3controller} from './part3';
import {controller as part4controller} from './part4';
import {controller as part5controller} from './part5';

window.addEventListener("DOMContentLoaded", main);

type Controller = {
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
    } else if( hash == "#p4" ) {
        mainController = part4controller;
    } else if( hash == "#p5" ) {
        mainController = part5controller;
    } else {
        mainController = part1controller;
    }

    mainController.init();
    window.addEventListener( "resize", mainController.resize );
}
