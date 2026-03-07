import {Image} from "./image";
import * as fs from 'node:fs';
import {tosRGB, clampVec3} from "./utils";
import {encode} from 'fast-png';
import {Vec3} from "gl-matrix";

const writer = {

    writeImagePpm( img : Image, fname : string ) : void {
        let fd = null;
        try {
            fd = fs.openSync(fname, 'w');

            fs.writeSync(fd, `P3\n`);
            fs.writeSync(fd, `${img.size[0]} ${img.size[1]}\n`);
            fs.writeSync(fd, `255\n`);

            for (let y = 0; y < img.height; y++) {
                for (let x = 0; x < img.width; x++) {
                    let pixColor = img.getPixel(x, y);

                    // Make infinite colors stand out as magenta
                    if (!isFinite(pixColor[0]) || !isFinite(pixColor[1]) || !isFinite(pixColor[2])) {
                        pixColor = new Vec3([1.0, 0.0, 1.0]);
                    }

                    const srgb = clampVec3(tosRGB(pixColor), 0.0, 1.0);
                    const r = Math.trunc( srgb[0] * 255 );
                    const g = Math.trunc( srgb[1] * 255 );
                    const b = Math.trunc( srgb[2] * 255 );

                    fs.writeSync(fd,`${r} ${g} ${b} `);
                }
            }

        } catch (e) {
            console.error(e);
        } finally {
            if( fd !== null ) fs.closeSync(fd);
        }
    },

    writeImagePng( img : Image, fname : string ) : void {
        const data = new Uint8ClampedArray(img.width * img.height * 3);
        let index = 0;

        for (let y = 0; y < img.height; y++) {
            for (let x = 0; x < img.width; x++) {
                let pixColor = img.getPixel(x, y);

                // Make infinite colors stand out as magenta
                if (!isFinite(pixColor[0]) || !isFinite(pixColor[1]) || !isFinite(pixColor[2])) {
                    pixColor = new Vec3(1.0, 0.0, 1.0);
                }

                const srgb = clampVec3(tosRGB(pixColor), 0.0, 1.0);
                const r = Math.trunc( srgb[0] * 255 );
                const g = Math.trunc( srgb[1] * 255 );
                const b = Math.trunc( srgb[2] * 255 );

                data[index++] = r;
                data[index++] = g;
                data[index++] = b;
            }
        }

        const png = encode( {
            width: img.width,
            height: img.height,
            depth: 8,
            channels: 3,
            data
        });

        let fd = -1;
        try {
            fd = fs.openSync(fname, 'w');
            fs.writeSync(fd, png);
        } catch (e) {
            console.error(e);
        } finally {
            if( !fd ) fs.closeSync(fd);
        }
    }

};

export default writer;