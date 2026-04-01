import {Camera} from "./camera.ts";

enum OrbitControllerState {
    IDLE,
    ROTATING
}

export class OrbitController {

    camera : Camera;
    canvas : HTMLCanvasElement;
    state : number;
    mousePrevious : [number, number];
    handlers = {
        mousedown: (e : MouseEvent ) => this.onMouseDown(e),
        mousewheel: (e: WheelEvent) => this.onMouseWheel(e),
        mouseup: () => this.onMouseUp(),
        mousemove: (e: MouseEvent) => this.onMouseMove(e)
    };

    constructor( cam: Camera, canv :HTMLCanvasElement ) {
        this.camera = cam;
        this.canvas = canv;
        this.state = OrbitControllerState.IDLE;
        this.mousePrevious = [0,0];

        this.canvas.addEventListener("mousedown", this.handlers.mousedown, false);
        this.canvas.addEventListener('wheel', this.handlers.mousewheel, false );
    }

    onMouseDown(evt : MouseEvent): void {
        const mouseX = evt.pageX;
        const mouseY = evt.pageY;
        this.mousePrevious[0] = mouseX; this.mousePrevious[1] = mouseY;
        this.state = OrbitControllerState.ROTATING;
        
        document.addEventListener( 'mousemove', this.handlers.mousemove, false );
		document.addEventListener( 'mouseup', this.handlers.mouseup, false );
    }

    onMouseWheel(evt : WheelEvent) : void {
        evt.preventDefault();

        // cross-browser wheel delta
        let delta = Math.max(-1, Math.min(1, evt.deltaY)) * 0.1;
        this.camera.dolly(delta);
    }

    onMouseMove(evt : MouseEvent) : void {
        evt.preventDefault();
        if( this.state === OrbitControllerState.ROTATING ) {
            const mouseX = evt.pageX;
            const mouseY = evt.pageY;
    
            this.camera.orbit( mouseX - this.mousePrevious[0], mouseY - this.mousePrevious[1]);
    
            this.mousePrevious[0] = mouseX;
            this.mousePrevious[1] = mouseY;
        }
    }

    onMouseUp() : void {
        this.state = OrbitControllerState.IDLE;
        document.removeEventListener('mousemove', this.handlers.mousemove);
        document.removeEventListener('mouseup', this.handlers.mouseup);
    }

}