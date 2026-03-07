import {Ray} from '../src/ray.ts';
import {Image} from '../src/image.ts';
import {Vec3} from 'gl-matrix';
import {Camera} from "../src/camera.ts";
import {Sphere} from "../src/sphere.ts";
import imageWriter from "../src/image_writer.ts";

// TODO: No changes are needed to this file.  This test generates a render of a single sphere,
//  with colors determined by the normal vector at the intersection point.
function main() : Image {
    console.log();
    console.log("--------------------------------------------------------");
    console.log("TASK 5: Sphere image");
    console.log("--------------------------------------------------------");

    // The output image
    const ray_image = new Image(500, 250);

    const sphere = new Sphere();

    // Set up a camera
    const camera = new Camera( {
        "vfov": 45,
        "resolution": [ray_image.width, ray_image.height],
        "fdist": 1,
        "transform": {
            "from": [0.0, 0.0, 3.0],
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

            // If we hit the sphere, output the sphere normal; otherwise,
            // convert the ray direction into a color so we can have some visual
            // debugging
            ray_image.setPixel(x, y, intersection2color(ray, sphere));
        }
    }
    console.log("Done.");

    function intersection2color(ray: Ray, sphere: Sphere): Vec3 {
        const hit = sphere.intersect(ray);
        const c = Vec3.clone(ray.d).normalize();
        if (hit) {
            Vec3.normalize(c, hit.sn);
        }

        c.add([1,1,1]);
        return c.scale(0.5);
    }

    return ray_image;
}

const img = main();
const file = "img/renders/05_sphere_intersect.png";
console.log(`Writing: ${file}`);
imageWriter.writeImagePng(img, file);
