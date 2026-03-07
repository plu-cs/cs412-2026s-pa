import {Mat4, Mat4Like, Vec3, Vec3Like, Vec4} from "gl-matrix";
import {Ray} from "./ray.ts";

/**
 * Represents an affine transformation and its inverse.
 */
class Transform {

    m : Mat4;     ///< The transformation matrix
    mInv : Mat4;  ///< The inverse of the transformation matrix

    constructor( m : Mat4Like = Mat4.create(), mInv: Mat4 | null  = null ) {
        this.m = new Mat4(m);
        this.mInv = mInv ?? Mat4.clone(this.m).invert();
    }

    multiply( other: Transform ) : Transform {
        const xform = new Transform();
        Mat4.multiply( xform.m, this.m, other.m );
        Mat4.multiply( xform.mInv, other.mInv, this.mInv );
        return xform;
    }

    inverse() : Transform {
        return new Transform(this.mInv, this.m);
    }

    transformPoint( point : Vec3Like ): Vec3 {
        // TODO: Task 3 - Transform the point by this matrix.  Points can be affected by translations,
        //   use a 1.0 in the 4th homogeneous coordinate when multiplying.  Return a 3-component vector.
        //   To get the first three components of a Vec4f v use v.xyz().
        
        return new Vec3();
    }

    transformVector(vector : Vec3Like) : Vec3 {
        // TODO: Task 3 - Transform the vector by this matrix.  Vectors should not be affected by translations,
        //   use a 0.0 in the 4th homogeneous coordinate to support this.  Return a 3-component vector.
        //   To get the first three components of a Vec4f v use v.xyz().
        
        return new Vec3();
    }

    transformNormal(normal : Vec3Like) : Vec3 {
        // TODO: Task 3 - Return a new Vec3f that is transformed by this Transform.  Normals are
        //   transformed differently than other vectors, you must use the inverse transpose of the
        //   matrix.  The inverse is available in m_inv.  As with vectors, use a 0.0 in the 4th
        //   homogeneous coordinate to avoid translation.  Make sure to return a normalized unit vector.
        
        return new Vec3();
    }

    transformRay(ray : Ray) : Ray {
        // TODO: Task 3 - Transform the ray's origin and direction and return a new Ray with the transformed
        //   values.  You can use the above methods to transform the origin and direction.  Make sure
        //   that you maintain the Ray's mint and maxt values.
        
        return new Ray();
    }
}

export {Transform};