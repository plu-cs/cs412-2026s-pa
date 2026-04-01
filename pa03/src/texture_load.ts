import {ImageBuffer} from "./image_buffer.ts";

export function loadTexture( url : string) : Promise<ImageBuffer> {

    return new Promise((resolve : (value : HTMLImageElement) => void, reject) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img) );
        img.addEventListener('error', () => {
            console.error("Unable to load texture: " + url);
            reject("Unable to load texture: " + url);
        });
        img.src = url;
    }).then( (img : HTMLImageElement) => {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const ctx = tempCanvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const imageData = ctx?.getImageData(0, 0, img.width, img.height);
        return new ImageBuffer(img.width, img.height, imageData?.data);
    });
}