import {Vec2, Vec3, Vec3Like} from 'gl-matrix';

/**
 * Image using floating point vec3 pixels.
 */
class Image {
    imageData: Vec3[];
    size: Vec2;

    constructor(width : number, height : number) {
        this.size = new Vec2(width, height);
        this.imageData = Array.from( { length: width * height }, () => Vec3.create() );
    }

    setPixel( x :number, y :number, value: Vec3Like ) : void {
        const idx = y * this.size[0] + x;
        Vec3.copy( this.imageData[ idx ], value );
    }

    addToPixel( x : number, y : number, value: Vec3Like ) : void {
        const idx = y * this.size[0] + x;
        this.imageData[idx].add(value);
    }

    getPixel( x:number, y:number ) : Vec3 {
        const idx = y * this.size[0] + x;
        return Vec3.clone( this.imageData[ idx ] );
    }

    get width() : number { return this.size[0]; }
    get height() : number { return this.size[1]; }

}

export {Image};
