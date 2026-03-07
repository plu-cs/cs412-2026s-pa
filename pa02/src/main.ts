import {styleText} from 'node:util';
import path from 'node:path';
import fs from 'node:fs';
import {Scene} from "./scene.ts";
import imageWriter from "./image_writer.ts";
import {Renderer,WhittedRenderer, PathRenderer} from "./renderer";

console.log("================================================");
console.log("      LuteRT - PLU Educational Ray Tracer");
console.log("================================================");

if( process.argv.length < 3 ) {
    console.log(`Usage: ${process.argv[0]} scene_file` );
    process.exit(1);
}

const inputPath = process.argv[2];
if( inputPath.length >= 5 && inputPath.substring( inputPath.length - 5 ) !== ".json" ) {
    console.log(`Input file must have '.json' extension` );
    process.exit(1);
}

// Read scene file and parse
console.log(styleText(['green'], `Reading scene file: ${inputPath}`));
const jsonText = fs.readFileSync(inputPath, 'utf8');
const j = JSON.parse(jsonText);
const rendererType = j.renderer ?? 'path';

const scene = new Scene(j);

let renderer : Renderer;
if( rendererType === 'path' ) {
    renderer = new PathRenderer(scene);
} else if( rendererType === 'whitted' ) {
    renderer = new WhittedRenderer(scene);
} else {
    console.log(styleText(['red'], `Invalid renderer type: ${rendererType}`));
    process.exit(1);
}

// GO!
console.log(`Rendering with ${rendererType} renderer, ${scene.samples} samples per pixel...`);
const image = renderer.render();

// File name without the extension
const baseName = path.basename(inputPath, '.json');

// Get current date
const now = new Date();
const dateStr = `${now.getFullYear()}${pad2(now.getMonth()+1)}${pad2(now.getDate())}_${pad2(now.getHours())}${pad2(now.getMinutes())}${pad2(now.getSeconds())}`;

const outputFileName = `img/renders/${baseName}-${scene.samples}spp-${dateStr}.png`;

// Write output
console.log(styleText(['green'],`Writing image to ${outputFileName}`));
imageWriter.writeImagePng(image, outputFileName);

function pad2(num: number): string {
    return num.toString().padStart(2, '0');
}