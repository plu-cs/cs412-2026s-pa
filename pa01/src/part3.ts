import GUI from 'lil-gui';
import {Mat4, Vec3, Vec3Like} from 'gl-matrix';
import * as Shapes from './shapes';

/**
 * A Bone represents a posable segment of a compound object.  Each bone has 
 * a joint somewhere relative to its center with a single rotation axis 
 * through that point.
 */
 class Bone {

    parent : Bone | null;        // the parent Bone, or null if this is the root Bone
    location : Vec3;      // the position of this Bone relative to the parent Bone 
    scale : Vec3;         // the scale (size) of this Bone in each dimension
    jointLocation : Vec3; // the location of the joint on this Bone relative to the Bone's center
    jointAxis : Vec3;     // the axis of rotation for the joint
    jointAngle : number;  // the angle of rotation around the joint axis (in radians)

    /**
     * Constructs a Bone
     */
    constructor(parent : Bone | null, location : Vec3Like, scale : Vec3Like, jointLocation : Vec3Like, jointAxis : Vec3Like) {
        this.parent = parent;
        this.location = new Vec3(location);
        this.scale = new Vec3(scale);
        this.jointLocation = new Vec3(jointLocation);
        this.jointAxis = new Vec3(jointAxis);
        this.jointAngle = 0;
    }

    /**
     * Returns the pose matrix for this bone.
     */
    poseMatrix() : Mat4 {
        //
        // TODO: Return the pose matrix for this Bone.
        //       The pose matrix includes a translation and a rotation.  The rotation should
        //       be applied first, and the translation second (i.e. translation * rotation).  
        //       The translation should position
        //       the bone based on this.location.  The rotation should rotate the bone around
        //       this.jointAxis at this.jointLocation (hint: you'll need a combination of three
        //       matrices to make this work).  If the Bone has a parent, you'll need to apply the
        //       parent's pose matrix *after* this Bone's matrix.  In other words, the parent's matrix
        //       should be pre-multiplied with this Bone's matrix (parentMatrix * thisMatrix).
        //

        return Mat4.create();  // Identity matrix, replace this
    }

    modelMatrix() : Mat4 {
        //
        // TODO: Return the model matrix for this Bone.
        //       The model matrix includes the scaling for this Bone.  The model matrix is 
        //       the pose matrix along with a scaling matrix.  The scaling matrix should be
        //       applied to points before the pose matrix (i.e. pose * scale).  Get the pose
        //       matrix by calling this.poseMatrix(), and return the product.
        //
        
        return Mat4.create();  // Identity matrix, replace this
    }
}

// This is the mesh used by ALL Bones
const cube = Shapes.cube(1.0);

const scene : Record<string, Bone> = { };

// Create the hierarchy of Bones (a tree or DAG of Bone objects)
scene['torso'] = new Bone(null,           [0.0, 0.55, 0],  [0.5, 0.15, 0.15],    [0,0,0],       [0,1,0]);
scene['thigh'] = new Bone(scene['torso'], [.175, -.3, 0],  [0.15, 0.45, 0.15],   [0, 0.225, 0], [1, 0, 0]);
scene['shin'] = new Bone(scene['thigh'],  [0, -.45, 0],    [0.15, 0.45, 0.15],   [0, 0.225, 0], [1,0,0]);

//
// TODO --- Add a foot and two toes to our hierarchy
//


// Called when the angle for one of the bones is changed in the GUI.  The name of the
// bone is provided in the first parameter.
export function angleChanged( name : string, angle : number ) : void {
    if( name in scene ) {
        scene[name].jointAngle = angle * Math.PI / 180.0;
        controller.draw();
    }
}

// Don't call this directly. Instead, call Main.draw(), which will clear the screen and then call this method.
export function drawShapes( ctx : CanvasRenderingContext2D ) : void {
    for( const bone of Object.values(scene) ) {
        cube.draw(ctx, bone.modelMatrix());
    }
}

///////////////////////////////////////////////////////////
///////////  Do not modify the code below /////////////////
///////////////////////////////////////////////////////////

class Part3Controller {
    guiState = {
        angle1: 0.0,
        angle2: 0.0,
        angle3: 0.0,
        angle4: 0.0,
        angle5: 0.0,
        angle6: 0.0
    };

    resize() {}

    init() {
        const gui = new GUI();
        gui.add( this.guiState, "angle1", -180.0, 180.0 ).name("Torso rotation: ")
            .onChange((v : number) => angleChanged("torso", v));
        gui.add( this.guiState, "angle2", -180.0, 180.0 ).name("Thigh rotation: ")
            .onChange((v : number) => angleChanged("thigh", v));
        gui.add( this.guiState, "angle3", -180.0, 180.0 ).name("Shin rotation: ")
            .onChange((v : number) => angleChanged("shin", v));
        gui.add( this.guiState, "angle4", -180.0, 180.0 ).name("Foot rotation: ")
            .onChange((v : number) => angleChanged("foot", v));
        gui.add( this.guiState, "angle5", -180.0, 180.0 ).name("Big toe rotation: ")
            .onChange((v : number) => angleChanged("bigToe", v));
        gui.add( this.guiState, "angle6", -180.0, 180.0 ).name("Other toes: ")
            .onChange((v : number) => angleChanged("otherToes", v));

        this.draw();
    }

    draw() {
        const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if( !ctx ) throw Error("Unable to get 2D context");
        
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'rgb(0,0,0)';
        drawShapes(ctx);
    }
}

export const controller = new Part3Controller();
