
import {Image} from "./image";
import {clampVec3, tosRGB} from "./utils.ts";

function imageToImageData(img: Image):ImageData {

    const data = new Uint8ClampedArray(img.width() * img.height() * 4);

    let index = 0;
    for (let y = 0; y < img.height(); y++) {
        for (let x = 0; x < img.width(); x++) {
            let pixColor = img.getPixel(x, y);

            // Make infinite colors stand out as magenta
            if (!isFinite(pixColor[0]) || !isFinite(pixColor[1]) || !isFinite(pixColor[2])) {
                pixColor = [1.0, 0.0, 1.0];
            }

            const srgb = clampVec3(tosRGB(pixColor), 0.0, 1.0);
            data[index] = Math.trunc( srgb[0] * 255 );
            data[index+1] = Math.trunc( srgb[1] * 255 );
            data[index+2] = Math.trunc( srgb[2] * 255 );
            data[index+3] = 255;
            index += 4;
        }
    }

    return new ImageData(data, img.width(), img.height());
}

export default imageToImageData;