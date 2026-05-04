import {controller as part1controller} from './main1';
import {controller as part2controller} from './main2';
import {controller as part3controller} from './main3';

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
    } else {
        mainController = part1controller;
    }

    mainController.init();
    window.addEventListener( "resize", mainController.resize );
}
