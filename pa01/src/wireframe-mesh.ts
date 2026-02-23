import {Mat4, Vec3} from 'gl-matrix';

export class WireframeMesh {
    private points : Array<Vec3>;
    private lines : Array<number>;

    constructor( pts: Array<Vec3>, lines: Array<number> ) {
        this.points = pts;
        this.lines = lines;
    }

    draw( ctx : CanvasRenderingContext2D, m : Mat4 | null = null ) : void {
        const canvas = ctx.canvas;
        const width = canvas.width, height = canvas.height;
        const aspect = width / height;
        const ortho = {
            left: -1.0, right: 1.0,
            bottom: -1.0 / aspect, top: 1.0 / aspect
        };
        if( height > width ) {
            ortho.left = -aspect; ortho.right = aspect;
            ortho.bottom = -1.0; ortho.top = 1.0;
        }

        // Transformation matrix
        const matrix = Mat4.create();

        ///////// TODO:
        ///////// Part 1 - Multiply matrix with a perspective projection matrix (Mat4.perspectiveNO(...))
        /////////

        // Apply a translation to move things away from the "camera"
        Mat4.translate(matrix, matrix, [0,0,-2.5]);
        
        ///////// TODO:
        ///////// Part 1 - If the parameter m is not null, post-multiply with matrix and store the result
        /////////          in matrix.  The parameter m is used by the caller to transform individual objects.
        /////////
        // add code here
        /////////

        ctx.beginPath();
        for( let i = 0; i < this.lines.length; i += 2 ) {
            const idx0 = this.lines[i  ];
            const idx1 = this.lines[i+1];

            const p0 = this.points[idx0];
            const p1 = this.points[idx1];

            ///////// TODO
            ///////// Part 1 - p0 and p1 are the positions of the endpoint of the line.  Transform them with
            /////////          matrix here before drawing the line.  (Use Vec3.transformMat4)  Replace the following
            /////////          two lines
            /////////
            const proj0 = p0;
            const proj1 = p1;
            /////////

            // Invert y axis, scale, center in viewport
            let s1 = width * 0.5, s2 = height * 0.5;
            const screen0 = [(proj0[0] + 1) * s1, height - (proj0[1] + 1) * s2];
            const screen1 = [(proj1[0] + 1) * s1, height - (proj1[1] + 1) * s2];

            ctx.moveTo(screen0[0], screen0[1]);
            ctx.lineTo(screen1[0], screen1[1]);
        }
        ctx.stroke();
    }

}