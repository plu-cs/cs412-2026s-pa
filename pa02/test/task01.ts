import {Ray} from '../src/ray.ts';
import {Image} from '../src/image.ts';
import {Vec3} from 'gl-matrix';
import imageWriter from '../src/image_writer.ts';

function main() : Image {
    console.log();
    console.log("--------------------------------------------------------");
    console.log("TASK 1: Generating rays by hand");
    console.log("--------------------------------------------------------");

    // The output image
    const ray_image = new Image(500, 250);

    const camera_origin: Vec3 = new Vec3([0, 0, 0]);
    const image_plane_width = 4;
    const image_plane_height = 2;

    // TODO: Imagine that the image grid is centered at z = -1, aligned parallel to the x-y plane.
    // Calculate upperLeft - the position of the upper left corner of the image grid using the above values
    // for image_plane_width and image_plane_height.  Then, calculate the 3d vector pixelU pointing in the
    // x direction, with a magnitude equal to the width of a pixel in the image plane. Compute
    // pixelV, a vector pointing in the negative y direction with a magnitude equal to the height
    // of a pixel in the image plane.
    
    

    console.log("Rendering...");
    
    // loop over all pixels and generate one ray for each
    for (let y = 0; y < ray_image.height; y++) {
        for (let x = 0; x < ray_image.width; x++) {
            const ray = new Ray(camera_origin);

            // TODO: Find a ray that starts at camera_origin and goes through the CENTER of
            //   the pixel at (x, y).  The ray origin is set to the camera's origin (above).
            //   Compute and set the ray's direction such that the ray goes through the center of
            //   the pixel at (x, y).  We'll indicate the center of the pixel as (x + 0.5, y + 0.5):
            //      upperLeft + (x + 0.5) * pixelU + (y + 0.5) * pixelV
            //   See RTOW Section 4.2

            

            // Generate a visual color for the ray so we can debug our ray directions
            ray_image.setPixel(x, y, ray2color(ray));
        }
    }
    console.log("Done.");

    function ray2color(ray: Ray): Vec3 {
        const c = Vec3.clone(ray.d).normalize();
        c.add([1,1,1]);
        return c.scale(0.5);
    }

    return ray_image;
}

const img = main();
const file = "img/renders/01_manual_ray_image.png";
console.log(`Writing: ${file}`);
imageWriter.writeImagePng(img, file);
