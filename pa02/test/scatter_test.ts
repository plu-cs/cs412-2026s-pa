import {HitRecord} from "../src/hit_record.ts";
import {Vec3, Vec2} from 'gl-matrix';
import {Ray} from "../src/ray";
import {Material} from '../src/materials';
import {toSphericalDir, Constants} from "../src/utils.ts";
import {Image} from "../src/image.ts";
import {colorMap} from "./heatmap.ts";
import imageWriter from "../src/image_writer.ts";
import Progress from "../src/progress.ts";

export {scatterTest};

interface ScatterTestParameters {
    message: string,
    imageSize: Vec2,
    samples: number,
    normal: Vec3,
    material: Material,
    outFile: string,
    incomingDir: Vec3
}

function scatterTest( params : ScatterTestParameters ) : void {

    const samples = 1000 * (params.imageSize.x * params.imageSize.y);
    const hit = new HitRecord();
    hit.gn = Vec3.clone(params.normal);
    hit.sn = Vec3.clone(hit.gn);

    console.log(`${params.message} - normal (${params.normal}), incoming (${params.incomingDir})`);
    console.log("Testing %d rays...", samples);

    const histogram = Array.from({length: params.imageSize.x * params.imageSize.y}).fill(0) as number[];
    let validSamples = 0;
    const incomingRay = new Ray(new Vec3(0,0,0), params.incomingDir);
    let nanOrInf = false;
    let belowHemiCount = 0;

    const prog = new Progress(samples);
    for( let i = 0; i < samples; i++ ) {
        const scat = params.material.scatter(incomingRay, hit);
        if(! scat ) continue;

        if( ! ( Number.isFinite(scat.scattered.d.x) &&
                Number.isFinite(scat.scattered.d.y) &&
                Number.isFinite(scat.scattered.d.z) ) ) {
            nanOrInf = true;
            continue;
        }

        const dir = Vec3.clone(scat.scattered.d).normalize();

        if( Vec3.dot(dir, hit.sn) < -1e-6 ) {
            belowHemiCount++;
            continue;
        }

        const s = toSphericalDir( dir );
        const pixel = new Vec2(
            Math.floor(s.x * params.imageSize.x * Constants.INV_TWO_PI),
            Math.floor(s.y * params.imageSize.y * Constants.INV_PI ) );

        const sinTheta = Math.max(1e-8, Math.sqrt(Math.max(1.0 - dir.z * dir.z, 0.0)));
        const weight = histogram.length / (Math.PI * 2.0 * Math.PI * sinTheta * samples);
        const val = histogram[ (params.imageSize.x * pixel.y) + pixel.x ] + weight;

        if( !Number.isFinite(val) ) {
            console.log("NaN or Infinite");
            continue;
        }
        histogram[ (params.imageSize.x * pixel.y) + pixel.x ] = val;

        validSamples++;
        if( i % 5000 === 0 ) prog.inc( 5000 );
    }
    prog.finished();

    if( nanOrInf ) {
        throw new Error("ERROR: detected NaN or Infinite values in some scattered rays.");
    }

    if( belowHemiCount > 0 ) {
        throw new Error("ERROR: some scattered rays were below the surface.  This should not happen.");
    }

    const pctOk = (100.0 * validSamples) / samples;
    console.log(`${pctOk.toFixed(1)}% of rays were valid.`);

    if( pctOk < 90.0 ) {
        throw new Error("ERROR: too many rays were invalid!");
    }

    // Find 99.95% largest value, to avoid outliers
    const orderedValues = histogram.toSorted( (a, b) => a - b );
    const max = orderedValues[Math.floor((orderedValues.length - 1) * 0.9995)];

    // Upsample by a factor of 4 in each dimension and apply heatmap
    const upscale = 4;
    const largeSize = new Vec2(params.imageSize.x * upscale, params.imageSize.y * upscale);
    const histImage = new Image( largeSize.x, largeSize.y );
    for( let y = 0; y < largeSize.y; y++ ) {
        for(let x = 0; x < largeSize.x ; x++ ) {
            const value = histogram[ params.imageSize.x * Math.floor(y/upscale) + Math.floor(x/upscale) ] * (1.0 / max);
            const color = colorMap(value);
            histImage.setPixel(x, y, color);
        }
    }

    imageWriter.writeImagePng(histImage, params.outFile);
    console.log(`Histogram written to: ${params.outFile}`);
}