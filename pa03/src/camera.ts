import {Vec3, Mat4, Vec3Like} from 'gl-matrix';

export class Camera {

    position : Vec3;   // The camera's position
    rotation : Mat4;   // The camera's orientation
    aspect: number;    // aspect ratio
    near: number;      // Distance to the near plane
    far: number;       // Distance to the far plane
    fov: number;       // The vertical field of view angle (radians)

    /**
     * A constructor function for a Camera object.  Sets a default
     * camera frustum, position and orientation.
     * 
     * @param {number} aspect camera's (viewport's) aspect ratio
     * @param {number} near distance to the near plane
     * @param {number} far distance to the far plane
     * @param {number} fov the vertical field of view angle (radians)
     */
    constructor(aspect : number, near: number, far: number, fov: number) {
        this.position = new Vec3();
        this.rotation = new Mat4();
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.fov = fov;

        // Default camera location
        this.lookAt( [0,0,10], [0,0,0], [0,1,0] );
    }

    /**
     * Set the position and orientation of this camera based on the
     * given parameters.
     * 
     * @param {Vec3Like} pos camera position
     * @param {Vec3Like} at a point that the camera is facing toward
     * @param {Vec3Like} up the general upward direction for the camera
     */
    lookAt( pos : Vec3Like, at : Vec3Like, up :Vec3Like ) : void {
        this.position.copy( pos );

        let n = Vec3.clone(pos).sub( at ).normalize();   //  n = pos - at
        let u = new Vec3(Vec3.cross([0,0,0], up, n)).normalize();           //  u = up x n
        let v = new Vec3(Vec3.cross([0,0,0], n, u)).normalize();            //  v = n x u

        this.setRotation(u,v,n);
    }

    /**
     * Sets this camera's rotation matrix based on the camera's axes in world coordinates.
     * 
     * @param {Vec3Like} u camera's u/x axis
     * @param {Vec3Like} v camera's v/y axis
     * @param {Vec3Like} n camera's n/z axis
     */
    setRotation(u :Vec3Like, v : Vec3Like, n :Vec3Like) {
        this.rotation[0] = u[0]; this.rotation[4] = u[1]; this.rotation[8] = u[2];
        this.rotation[1] = v[0]; this.rotation[5] = v[1]; this.rotation[9] = v[2];
        this.rotation[2] = n[0]; this.rotation[6] = n[1]; this.rotation[10] = n[2];
    }

    /**
     * Computes and returns the view matrix for this camera.  
     * Essentially the product of this.rotation and an appropriate
     * translation based on this.position.
     * 
     * @returns {Mat4} the view matrix for this camera
     */
    viewMatrix(): Mat4 {
        const m = new Mat4();
        m[12] = -this.position[0];
        m[13] = -this.position[1];
        m[14] = -this.position[2];

        return Mat4.clone(this.rotation).multiply(m);
    }

    invViewMatrix() {
        const m = Mat4.clone( this.rotation ).transpose();
        m[12] = this.position[0];
        m[13] = this.position[1];
        m[14] = this.position[2];
        return m;
    }

    /**
     * Returns a matrix for transforming from world coordinates to NDC (Normalized Device Coordinates)
     * or "clip coordinates."  The projection matrix multiplied by the camera transform.
     *
     * @return {Mat4} the world-to-clip matrix
     */
    worldToClip() : Mat4 {
        const m = new Mat4().perspectiveZO(this.fov, this.aspect, this.near, this.far);
        m.mul(this.viewMatrix());
        return m;
    }

    /**
     * Orbits this camera object around a sphere centered at the origin.
     * The mouse's delta x corresponds to a rotation around the world y axis, 
     * and the mouse's delta y corresponds to a rotation round the camera's 
     * x axis through the origin.
     * 
     * @param {number} dx the change in the mouse's x coordinate
     * @param {number} dy the change in the mouse's y coordinate
     */
    orbit(dx:number, dy:number):void {
        const yang = -dx * 0.01;
        const xang = -dy * 0.01;
        const camx = [this.rotation[0], this.rotation[4], this.rotation[8]] as Vec3Like;

        // The rotation matrix
        const m = Mat4.fromYRotation(new Mat4(), yang) as Mat4;  // (2) rotate around global y
        m.rotate(xang, camx); // (1) Rotate around camera's x axis

        // Rotate the camera's axes, and reset the rotation matrix
        const axes = Mat4.transpose( new Mat4(), this.rotation) as Mat4;        
        Mat4.multiply(axes, m, axes);
        axes.transpose();
        this.rotation.copy(axes);

        // Rotate the camera's position
        Vec3.transformMat4(this.position, this.position, m);
    }

    /**
     * Moves the camera along its n axis.
     * @param amount amount to move along the camera's n axis
     */
    dolly( amount : number ) : void  {
        let d = amount;
        const distToOrigin = this.position.mag;
        const minDistance = 0.5;
        if( d < 0 && -d > distToOrigin - minDistance ) {
            d = minDistance - distToOrigin;
        }
        const n = [ this.rotation[2], this.rotation[6], this.rotation[10] ] as Vec3Like;
        this.position.scaleAndAdd(n, d);
    }

}