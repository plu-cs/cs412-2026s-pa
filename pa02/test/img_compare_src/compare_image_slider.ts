
export function initCompareImageSliders() {
    document.querySelectorAll(".img-compare-t").forEach( (el) => buildElements(el as HTMLElement) );
    document.querySelectorAll(".img-compare").forEach( (el) => imageCompare(el as HTMLElement) );
}

function buildElements( container : HTMLElement ) : void {
    const images = container.querySelectorAll('img');
    if( images.length < 2 ) {
        console.error("image-compare container must contain 2 image elements");
        return;
    }

    container.classList.add("card", "mb-4");

    let header = container.querySelector('.img-compare-title');
    if( !header ) {
        header = document.createElement('div');
    }
    header.classList.add('card-header');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const compareContainer = document.createElement('div');
    compareContainer.classList.add('img-compare', 'mb-3');

    const imgAContainer = document.createElement('div');
    const imgALabel = document.createElement('div');
    imgALabel.classList.add('label');
    imgALabel.innerText = "Reference";
    const imgBContainer = document.createElement('div');
    const imgBLabel = document.createElement('div');
    imgBLabel.classList.add('label');
    imgBLabel.innerText = "Mine";

    imgAContainer.appendChild(images[0]);
    imgAContainer.appendChild(imgALabel);

    imgBContainer.appendChild(images[1]);
    imgBContainer.appendChild(imgBLabel);

    compareContainer.appendChild(imgAContainer);
    compareContainer.appendChild(imgBContainer);

    cardBody.appendChild(compareContainer);

    container.appendChild(header);
    container.appendChild(cardBody);
}

function imageCompare( container : HTMLElement ) : void {
    const slider = document.createElement("div");
    slider.classList.add("img-compare-slider");
    container.appendChild( slider );
    const sliderDefaultOpacity = slider.style.opacity;

    const imageDiv = container.children;
    const firstImageDiv = imageDiv[0] as HTMLImageElement;
    const secondImageDiv = imageDiv[1] as HTMLImageElement;
    const width = firstImageDiv.clientWidth;
    const height = firstImageDiv.clientHeight;

    // Make the second image container the same size as the first if it isn't already
    if( secondImageDiv.clientWidth !== width ) secondImageDiv.style.width = width + "px";
    if( secondImageDiv.clientWidth !== height ) secondImageDiv.style.height = height + "px";

    // Position slider in the center
    slider.style.top =  (height / 2 - slider.offsetWidth / 2) + "px";
    slider.style.left = (width / 2 - slider.offsetHeight / 2) + "px";

    // Set the first image to half width
    firstImageDiv.style.width = (width / 2) + "px";

    let dragging = false;

    const mouseMove = (e : MouseEvent) => {
        if( !dragging ) return;

        // Get the x position of the mouse, relative to the first image
        const a = firstImageDiv.getBoundingClientRect();
        let x = e.pageX - a.left;
        x = x - window.scrollX;  // Consider horizontal scrolling

        // Prevent the slider from being positioned outside the image
        if (x < 0) x = 0;
        if (x > width) x = width;

        // Resize the image
        firstImageDiv.style.width = x + "px";
        // Position the slider
        slider.style.left = (firstImageDiv.offsetWidth - slider.offsetWidth / 2) + "px";
    };

    slider.addEventListener("mousedown", (e:MouseEvent) => {
        e.preventDefault();
        slider.style.opacity = "0.33";
        dragging = true;
        window.addEventListener("mousemove", mouseMove);
    });

    window.addEventListener("mouseup", () => {
        dragging = false;
        slider.style.opacity = sliderDefaultOpacity;
        window.removeEventListener("mousemove", mouseMove);
    });
}