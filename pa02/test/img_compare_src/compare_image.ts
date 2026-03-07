import {initCompareImageSliders} from "./compare_image_slider.ts";

interface CompareData {
    imgA: HTMLImageElement,
    imgB: HTMLImageElement,
    element: Element
}

function compareImages() {

    const tempCanvas = document.createElement("canvas");

    function compareImage(data:CompareData) {
        const imageDataA = convertToImageData(data.imgA);
        const imageDataB = convertToImageData(data.imgB);

        buildContent( data.element );
        compare(imageDataA, imageDataB, data.element);
    }

    function buildContent( el : Element ) : void {
        const outputEl = document.createElement('p');
        outputEl.classList.add('img-compare-stats', 'mb-0');
        outputEl.innerHTML = 'RMS: <span class="rms-output"></span>';
        el.querySelector('.card-body')?.appendChild(outputEl);
    }

    function convertToImageData(img: HTMLImageElement): ImageData {
        const context = tempCanvas.getContext('2d', { willReadFrequently: true});
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;

        context?.drawImage(img, 0, 0)
        if (context !== null) {
            return context.getImageData(0, 0, img.width, img.height);
        } else {
            throw new Error("Could not convert image data");
        }
    }

    function compare(image: ImageData, refImage: ImageData, el : Element): void {
        let r_rms = 0, g_rms = 0, b_rms = 0;
        const size = image.width * image.height;
        for (let i = 0; i < size * 4; i += 4) {
            r_rms += (image.data[i] - refImage.data[i]) * (image.data[i] - refImage.data[i]);
            g_rms += (image.data[i + 1] - refImage.data[i + 1]) * (image.data[i + 1] - refImage.data[i + 1]);
            b_rms += (image.data[i + 2] - refImage.data[i + 2]) * (image.data[i + 2] - refImage.data[i + 2]);
        }
        r_rms = Math.sqrt(r_rms / size);
        g_rms = Math.sqrt(g_rms / size);
        b_rms = Math.sqrt(b_rms / size);

        const outputEl = el.querySelector('.rms-output') as HTMLElement;
        outputEl.innerText = `(${r_rms.toFixed(2)}, ${g_rms.toFixed(2)}, ${b_rms.toFixed(2)})`;
    }

    // Detect which images are broken so that we don't test them
    const containers = Array.from( document.querySelectorAll('.img-compare-t') );

    const filtered = containers.filter( el => {
        const images = el.querySelectorAll('img');
        if (images.length !== 2) return false;
        if( images[0].width !== images[1].width || images[0].height !== images[1].height ) return false;
        const imagesArray = Array.from(images);
        return imagesArray.every(image => !(image.complete && image.naturalHeight === 0) );
    });
    filtered.forEach( el => {
        const images = el.querySelectorAll('img');
        compareImage({
            imgA: images[0],
            imgB: images[1],
            element: el
        });
    });
}

window.addEventListener("load", initCompareImageSliders);
window.addEventListener("load", compareImages);
