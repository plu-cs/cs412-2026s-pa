import {Ray} from '../src/ray.ts';
import {Image} from '../src/image.ts';
import {Vec3} from 'gl-matrix';
import {Camera} from "../src/camera.ts";
import imageWriter from "../src/image_writer.ts";

// TODO: No changes are needed to this file.  For this task, all changes will be
//   in the Camera class.  Update the generate_ray method in camera.cpp, so that the
//   Ray is transformed into world coordinates using the transform.
function main() : Image {
    console.log();
    console.log("--------------------------------------------------------");
    console.log("TASK 4: Camera class with transform");
    console.log("--------------------------------------------------------");

    // The output image
    const ray_image = new Image(500, 250);

    // Set up a camera
    const camera = new Camera( {
        "vfov": 90,
        "resolution": [ray_image.width, ray_image.height],
        "fdist": 1,
        "transform": {
            "from": [5.0, 15.0, -25.0],
            "at": [0.0, 0.0, 0.0],
            "up": [0.0, 1.0, 0.0]
        }
    });

    console.log("Rendering...");
    // loop over all pixels and generate one ray for each
    for (let y = 0; y < ray_image.height; y++) {
        for (let x = 0; x < ray_image.width; x++) {

            // Add 0.5 to get the pixel center
            const ray = camera.generateRay([x + 0.5, y + 0.5]);

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
const file = "img/renders/04_camera_ray_image_xform.png";
console.log(`Writing: ${file}`);
imageWriter.writeImagePng(img, file);
