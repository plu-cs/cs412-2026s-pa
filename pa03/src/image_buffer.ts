import {Vec3Like} from "gl-matrix";

export class ImageBuffer {

    data : Uint8ClampedArray;  // The pixel storage

    // Image dimensions
    width : number;
    height : number;

    constructor(width: number, height: number, imageData : Uint8ClampedArray | undefined = undefined) {
        this.width = width;
        this.height = height;

        if( imageData ) {
            this.data = new Uint8ClampedArray(imageData);
        } else {
            this.data = new Uint8ClampedArray(this.width * this.height * 4);
        }
    }

    /**
     * Set the given pixel to the given RGB color
     * @param x the x coordinate (integer, screen coordinates)
     * @param y the y coordinate (integer, screen coordinates)
     * @param {Vec3Like} color the color in RGB [0, 1]
     */
    setPixel(x: number, y: number, color: Vec3Like) : void {
        if( x >= 0 && x < this.width && y >= 0 && y < this.height ) {
            y = this.height - 1 - y;
            const idx = ( y * this.width + x ) * 4;
            this.data[idx  ] = color[0] * 255;
            this.data[idx+1] = color[1] * 255;
            this.data[idx+2] = color[2] * 255;
            this.data[idx+3] = 255;
        }
    }

    getPixel( x : number, y : number ) : Vec3Like | undefined {
        if( x >= 0 && x < this.width && y >= 0 && y < this.height ) {
            y = this.height - 1 - y;
            const idx = ( y * this.width + x ) * 4;
            return [
                this.data[idx  ] / 255,
                this.data[idx+1] / 255,
                this.data[idx+2] / 255
            ];
        }
        return undefined;
    }

    /**
     * Sets all pixels to black.
     */
    clear() : void {
        for(let i = 0; i < this.data.length; i++) {
            if( i % 4 === 3 ) this.data[i] = 255;
            else this.data[i] = 0;
        }
    }
}