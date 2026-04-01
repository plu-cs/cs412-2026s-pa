import {ImageBuffer} from "./image_buffer.ts";
import {Mesh} from "./mesh.ts";
import {Camera} from "./camera.ts";
import {Mat4, Vec2, Vec2Like, Vec3, Vec3Like, Vec4} from "gl-matrix";

export enum RenderMode {
    WIRE,
    TEXTURE_ONLY,
    FLAT,
    GOURAUD,
    PHONG,
    PHONG_TEXTURE
}

interface Bbox {
    min: Vec2Like,
    max: Vec2Like
}

export class Renderer {

    width: number;
    height: number;
    imageBuffer : ImageBuffer;       // The output image
    zBuffer : Array<Array<number>>;  // depth (z) buffer
    camera : Camera;                 // camera parameters
    mesh : Mesh | null;              // the mesh to render
    renderMode : RenderMode;         // mode
    backfaceCulling : boolean;       // enable/disable backface culling
    lightPosition : Vec3;            // world space light position
    material : {                     // Material properties
        ambient: Vec3Like,
        diffuse: Vec3Like,
        specular: Vec3Like,
        shininess: number,
        texture : ImageBuffer | null
    };

    constructor( width: number, height: number ) {
        this.width = width;
        this.height = height;
        this.camera = new Camera(width / height, 0.2, 100.0, 48.0 * Math.PI / 180.0);
        this.mesh = null;
        this.renderMode = RenderMode.WIRE;
        this.backfaceCulling = false;
        this.lightPosition = new Vec3(10,10,10);
        this.material = {
            ambient: [0.1, 0.1, 0.1],
            diffuse: [0.8, 0.8, 0.8],
            specular: [1.0, 1.0, 1.0],
            shininess: 100,
            texture : null
        };
        this.imageBuffer = new ImageBuffer( width, height );
        this.zBuffer = Array.from( { length: width } ).map( () => new Array( height ) );
    }

    resize( width: number, height: number ) {
        this.imageBuffer = new ImageBuffer( width, height );
        this.zBuffer = Array.from( { length: width } ).map( () => new Array( height ) );
        this.camera.aspect = width / height;
        this.width = width;
        this.height = height;
    }

    clear() {
        this.imageBuffer.clear();
        for( let x = 0; x < this.imageBuffer.width; x++ ) {
            for( let y = 0; y < this.imageBuffer.height; y++ ) {
                this.zBuffer[x][y] = 1.0;
            }
        }
    }

    render() : void {
        if( ! this.mesh ) return;

        this.clear();

        const worldToClip = this.camera.worldToClip();

        for( let i = 0 ; i < this.mesh.verts.length; i += 3 ) {
            const p = [
                this.mesh.points[ this.mesh.verts[ i ].p ],
                this.mesh.points[ this.mesh.verts[ i + 1 ].p ],
                this.mesh.points[ this.mesh.verts[ i + 2 ].p ]
            ];
            const n = [
                this.mesh.normals[ this.mesh.verts[ i ].n ],
                this.mesh.normals[ this.mesh.verts[ i + 1 ].n ],
                this.mesh.normals[ this.mesh.verts[ i + 2 ].n ]
            ];
            let uvs = undefined;
            if( this.mesh.uvs.length > 0 ) {
                uvs = [
                    this.mesh.uvs[ this.mesh.verts[ i ].uv ],
                    this.mesh.uvs[ this.mesh.verts[ i + 1 ].uv ],
                    this.mesh.uvs[ this.mesh.verts[ i + 2 ].uv ]
                ]
            }

            this.drawTriangle( p, n, uvs, worldToClip );
        }
    }

    drawTriangle( points : Readonly<Vec3[]>, normals : Readonly<Vec3[]>, uvs : Vec2[] | undefined, worldToClip : Mat4 ) : void {
        const screenPoints = this.toScreenSpace( points, worldToClip );
        if( ! screenPoints ) return;  // Triangle was culled or is outside frustum

        switch( this.renderMode ) {
            case RenderMode.WIRE:
                this.drawTriangleWire(screenPoints);
                break;
            case RenderMode.TEXTURE_ONLY:
                this.drawTriangleTex(screenPoints, uvs);
                break;
            case RenderMode.FLAT:
                this.drawTriangleFlat( screenPoints, points, normals );
                break;
            case RenderMode.GOURAUD:
                this.drawTriangleGouraud( screenPoints, points, normals );
                break;
            case RenderMode.PHONG:
                this.drawTrianglePhong( screenPoints, points, normals, uvs, false );
                break;
            case RenderMode.PHONG_TEXTURE:
                this.drawTrianglePhong( screenPoints, points, normals, uvs, true );
                break;
        }
    }

    drawTriangleWire( screenPoints : Vec4[] ) : void {
        const color = this.material.diffuse;
        for (let i = 0; i < 3; i++) {
            const va = screenPoints[(i + 1) % 3];
            const vb = screenPoints[(i + 2) % 3];

            const ba = new Vec2(vb.x - va.x, vb.y - va.y);
            const len = ba.magnitude;
            ba.normalize();
            // draw line
            for (let j = 0; j < len; j += 0.5) {
                const x = Math.round(va.x + ba.x * j);
                const y = Math.round(va.y + ba.y * j);
                this.imageBuffer.setPixel(x, y, color);
            }
        }
    }

    /**
     * TODO: Part 1
     * 
     * Given the vertices of a triangle, transform them to clip space using the given matrix.
     * In this assignment, we are using a perspective projection matrix that transforms the z 
     * coordinate of the view volume to the range [0, 1].  The x and y coordinates of points 
     * within the view volume are mapped to the range [-1,1].
     * After transformation, the w coordinate contains the camera space -z (see the lecture slides
     * for details).
     * 
     * Convert the clip-space coordinates to screen space using a linear transformation.  The dimensions
     * of the screen are in this.width and this.height.  Don't forget to divide by the w coordinate
     * first.
     * 
     *  - Store the value of 1 / -z (where z is the camera space z coordinate) in the w coordinate of the
     *    result.  We'll need this later for interpolation.
     *  - If backface culling is enabled (this.backfaceCulling is true), then return undefined if the triangle
     *    is facing away from the camera.  You can determine this in screen space by noting the winding of 
     *    the vertices.  If the order is CCW, it is a front face, otherwise it is a back face.  You can determine
     *    the winding by using the cross product (see the equation in the assignment).
     *  - If any of the vertices have a depth value outside of the range [0,1], then we will 
     *    not draw that triangle (return undefined).
     * 
     * @param points the triangle points in world space
     * @param worldToClip matrix that converts from world space to clip coordinates
     * @return the coordinates of the triangle's vertices in screen space
     */
    toScreenSpace( points : Readonly<Vec3[]>, worldToClip : Mat4 ) : Vec4[] | undefined{
        
       return undefined;  // Replace
    }

    /**
     * Part 4
     * 
     * Draw the triangle with a texture applied.  Calculate the bounding box for the triangle,
     * then, loop over all pixels within the bounding box, and call Renderer.barycentric to test
     * whether the pixel is within the triangle.  If not, do nothing.  Otherwise, store the 
     * barycentric coordinates for interpolation.  Also, note that the w coordinate of the screen
     * points stores the inverse camera space z coordinate, which is needed for perspective correct
     * interpolation.  For each pixel within the triangle:
     * 
     *   - Depth test: The z coordinate of the screen point is the depth of the vertex (range [0,1]).
     *     The variable this.zBuffer is the depth buffer.  The depth value is proportional to the inverse
     *     of the camera space z, so hyperbolic interpolation is NOT required. Interpolate the depth using LINEAR
     *     interpolation and test against the depth buffer.  If the depth is greater or equal to the value in
     *     the depth buffer, then the pixel should not be modified.  Otherwise, store the depth in the
     *     buffer and continue.
     *   - Interpolate the uv coordinates to get an interpolated value at the pixel location.
     *   - Use the interpolated uv to access the texture (this.material.texture). Use getPixel() to retrieve the color
     *     from the texture at the (u,v) location.  You must scale the (u,v) coordinates by the texture
     *     size (tex.width and tex.height) and truncate to an integer using Math.floor().  (Note: this.material.texture 
     *     may be null, and uvs may be undefined so you'll need to guard against that.)
     *   - Write the color from the texture to the image at the given location.
     * 
     * @param screenPoints the triangle coordinates in screen space including the depth in the 
     *      z coordinate, and the inverse camera space z in the w coordinate.
     * @param uvs the texture coordinates.
     */
    drawTriangleTex( screenPoints: Vec4[], uvs : Vec2[] | undefined) : void {
        
    }

    /**
     * Part 5 - Flat shading
     * 
     * Draw the triangle with a single color applied.  Calculate the color to apply by calling the 
     * method this.reflectionModel() with the world coordinates of the first point (and the normal).  
     * You'll need to implement the reflectionModel() method first (diffuse component only), once 
     * you're finished, come back here.
     * 
     * Similar to part 4, calculate the bounding box, loop over coordinates within the bounding box,
     * and for each pixel within the triangle:
     *   - interpolate depth (linearly) and perform the depth test as in the previous part
     *   - set the color of the pixel to the value you got from reflectionModel above.
     * 
     * @param screenPoints the triangle coordinates in screen space including the depth in the 
     *      z coordinate, and the inverse camera space z in the w coordinate.
     * @param worldPoints the triangle vertices in world coordinates
     * @param worldNormals the normal vectors in world coordinates
     */
    drawTriangleFlat( screenPoints : Vec4[], worldPoints : Readonly<Vec3[]>, worldNormals : Readonly<Vec3[]> ) : void {
        
    }

    /**
     * Part 6 - Gouraud shading
     * 
     * Draw the triangle using Gouraud shading.  
     * 
     * First, add the specular component to the shading model in `refelctionModel` below. 
     * 
     * Calculate the color for each of the three vertices by calling the method this.reflectionModel() 
     * (three times).  Store the three colors.
     * 
     * Similar to the previous part, calculate the bounding box, loop over pixels within the bounding box,
     * and for each pixel within the triangle:
     *   - interpolate depth and perform the depth test
     *   - interpolate the three colors 
     *   - set the color of the pixel to the interpolated color
     * 
     * @param screenPoints the triangle coordinates in screen space including the depth in the 
     *      z coordinate, and the inverse camera space z in the w coordinate.
     * @param worldPoints the triangle vertices in world coordinates
     * @param worldNormals the normal vectors in world coordinates
     */
    drawTriangleGouraud( screenPoints : Vec4[], worldPoints : Readonly<Vec3[]>, worldNormals : Readonly<Vec3[]> ) : void {
        
    }

    /**
     * Part 6 - Phong shading
     * 
     * Draw the triangle using Phong shading.  
     * 
     * Similar to the previous part, calculate the bounding box, loop over pixels within the bounding box,
     * and for each pixel within the triangle:
     *   - interpolate depth and perform the depth test
     *   - interpolate the normal vector
     *   - interpolate the world position
     *   - call reflectionModel() to determine the color
     *   - set the color of the pixel to the result
     * 
     * Part 7 - update the code so that if the parameter useTexture is true, interpolate the uv coordinates 
     * and use that to retrieve a value from the texture.  Then use the texture color as the diffuse 
     * reflectivity in the reflection model.
     * 
     * @param screenPoints the triangle coordinates in screen space including the depth in the 
     *      z coordinate, and the inverse camera space z in the w coordinate.
     * @param worldPoints the triangle vertices in world coordinates
     * @param worldNormals the normal vectors in world coordinates
     * @param uvs the texture coordinates
     * @param useTexture whether or not to apply the texture (part 7)
     */
    drawTrianglePhong( screenPoints : Vec4[], worldPoints : Readonly<Vec3[]>, worldNormals : Readonly<Vec3[]>,
                       uvs : Vec2[] | undefined, useTexture = false) : void {
        
    }

    /**
     * Part 2
     * 
     * Return the screen space, axis aligned bounding box containing the triangle, and clipped to the
     * edges of the screen.  The resulting bounding box should use integer coordinates.
     * 
     * @param screenPoints the screen space vertex positions
     * @returns a Bbox object with properties min and max.  min is the minimum x and y coordinates for the
     *   box, and max is the maximum.
     */
    boundingBox( screenPoints : Vec4[] ) : Bbox {
        return { min: new Vec2(0,0), max: new Vec2(0,0) };
    }

    /**
     * Part 3
     * 
     * Given a test location and the screen space coordinates of the triangle vertices, determine
     * if the test location is within the triangle, and if so, return the barycentric coordinates
     * of the position.  
     * 
     * @param screenPoints the screen space positions of the triangle vertices 
     * @param test a screen space location
     * @returns the barycentric coordinates as a Vec3, or undefined if test is not within the triangle
     */
    static barycentric( screenPoints : Vec4[], test : Vec2Like ) : Vec3Like | undefined {
        
        return undefined;
    }

    /**
     * Parts 5 and 6
     * 
     * Implement the Blinn-Phong reflection model.   this.lightPosition contains the world space light position.
     * Assume that the light source power is (1,1,1).
     * 
     * Part 5 - implement the diffuse and ambient parts only
     *     If the parameter diff is provided, use that as the diffuse reflectivity, otherwise, use
     *     this.material.diffuse.
     * Part 6 - add the specular component
     *    this.camera.position contains the world space camera position
     *    this.material.shininess contains the specular exponent
     *    use (1,1,1) as the specular reflectivity
     * 
     * @param worldPoint the triangle coordinates in world space
     * @param normal the triangle normals in world space
     * @param diff a diffuse color or undefined
     * @returns the color produced by the Blinn-Phong reflection model
     */
    reflectionModel( worldPoint : Readonly<Vec3Like>, normal : Readonly<Vec3Like>, diff : Vec3Like | undefined = undefined ) : Vec3 {

        return Vec3.create();
    }

}