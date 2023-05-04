class DonutCarousel extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.template = document.createElement('template');

        this.transforms = [
            `translate(-140%, 50%)`,
            `translate(-200%, -50%)`,
            `translate(-140%, -140%)`,
            `translate(-50%, -200%)`,
            `translate(40%, -140%)`,
            `translate(100%, -50%)`,
            `translate(50%, 50%)`,
            `translate(-50%, 100%)`,
        ]
        this.styles = [
            `translate(-135px, 38px) rotate(225deg)`,
            `translate(-170px, -46px) rotate(270deg)`,
            `translate(-136px, -129px) rotate(318deg)`,
            `translate(-52px, -165px) rotate(0deg)`,
            `translate(31px, -131px) rotate(45deg)`,
            `translate(67px, -49px) rotate(90deg)`,
            `translate(34px, 36px) rotate(135deg)`,
            `translate(-50px, 73px) rotate(180deg)`
        ];


        this.firstSlide = {};
        this.lastSlide = {};
        this.activeSlide = {
            index: 3,
            id: 3,
        }
        this.currSlide = 0;
        this.currAngle = 0;
    }

    connectedCallback() {
        this.template.innerHTML = `
        <div class="donutCarousel">
            <div class="imagePreview">
                <img id="previewImage" src="" alt="">
            </div>
            <div class="base" style="width: 350px; height: 225px; position: relative;overflow: hidden;">
                <div class="cartwheel" style="width: 350px;top:50px; height: 350px; background: none; border-radius: 50%; position: relative;">
                    <div class="middlePoint" style="width: 20px; height: 20px; border-radius: 50%; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);"></div>
                </div>
            </div>
        </div>
        `;
        this.firstSlide = {};
        this.lastSlide = {};
        this.activeSlide = {
            index: 3,
            id: 3,
        }
        this.currSlide = 0;
        this.currAngle = 0;

        this.shadow.appendChild(this.template.content.cloneNode(true));

        this.initAttributes();
        this.applyStyles();

        console.log(this.slidesArray);

        this.generateSildes();

        document.removeEventListener('keydown', (event) => {
            const keyName = event.key;
            if (keyName === 'ArrowRight') {
                this.pause();
                this.next();
            }
            if (keyName === 'ArrowLeft') {
                this.pause();
                this.prev();
            }
        });

        // trigget next function and prev function on arrow keys
        document.addEventListener('keydown', (event) => {
            const keyName = event.key;
            if (keyName === 'ArrowRight') {
                this.pause();
                this.next();
            }
            if (keyName === 'ArrowLeft') {
                this.pause();
                this.prev();
            }
        });
        
        setTimeout(() => {
            this.emitLoadedEvent();
        }, 100);
    }

    disconnectedCallback() {
        this.shadow.innerHTML = "";
    }

    emitLoadedEvent() {
        if (window.__adctvScreenShot == true) {
            let event = new CustomEvent("loaded", {
                detail: this.shadow.querySelector(".donutCarousel"),
                bubbles: true,
                cancelable: false,
                composed: true,
            });
            this.dispatchEvent(event);
        }
    }

    initAttributes() {
        let imagesTemp = this.getAttribute('donut-slide-images');
        this.images = this.getFilesFromUrls(imagesTemp);
        this.images = this.fixCount(this.images);

        let fullArrayTemp = this.getAttribute('donut-thumbnail-images');
        this.fullArray = this.getFilesFromUrls(fullArrayTemp);
        this.fullArray = this.fixCount(this.fullArray);

        this.bgColor = this.getAttribute('donut-background-colour');
        this.bgOpacity = this.getAttribute('donut-background-opacity');

        this.width = this.getAttribute('donut-slide-width');
        this.height = this.getAttribute('donut-slide-height');

        this.autoplay = this.getAttribute('donut-thumb-autoplay');
        this.autoplayInterval = this.getAttribute('donut-thumb-autoplayInterval');
        this.autoplayDirection = this.getAttribute('donut-thumb-autoplayDirection');
        this.previewBorderRadius = this.getAttribute('donut-slide-border-radius');

        this.slidesArray = this.fullArray.slice(0, 8);
    }

    applyStyles() {
        let style = document.createElement("style");
        style.innerHTML = `
            .donutCarousel{
                width: ${this.clientWidth}px;
                height: ${this.clientHeight}px;
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                align-items: center;
            }
            .imagePreview{
                height: ${this.clientHeight - 225}px;
                width: ${this.clientWidth}px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        `;
        this.shadow.appendChild(style);
    }

    getFilesFromUrls(files) {
        if (!files) {
            return;
        }
        let images = files.split(",");
        let slides = [];
        for (let i = 0; i < images.length; i++) {
            // let img = document.createElement("img");
            // img.src = decodeURIComponent(images[i]);
            slides.push(decodeURIComponent(images[i]));
        }
        return slides;
    }

    fixCount(array) {
        if (!array) {
            return;
        }
        while (array.length < 8) {
            array = array.concat(array);
        }
        return array;
    }




    //auto play function
    autoPlay = () => {
        if (this.autoplay == "true") {
            this.autoInterval = setInterval(() => {
                if (this.autoplayDirection == "left") {
                    this.next();
                } else {
                    this.prev();
                }
            }, this.autoplayInterval);
        }
    }

    disconnectedCallback() {
        this.shadow.innerHTML = "";
    }


    generateSildes = () => {

        //create slides
        this.slidesArray.forEach((slide, index) => {

            //create slide middle point
            var slideMiddle = document.createElement("div");
            slideMiddle.id = "slideMiddle_" + index;
            slideMiddle.style = "width: 20px; height: 20px; border-radius: 50%; position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);";

            var middlePoint = this.shadowRoot.querySelector(".middlePoint");
            middlePoint.appendChild(slideMiddle);

            var slide = document.createElement("div");
            slide.id = "slide_" + index;
            // slide.innerHTML = `<svg width="88" height="78" viewBox="0 0 88 78" xmlns="http://www.w3.org/2000/svg"><path d="M55.5347 77.6985C46.2088 74.7707 35.958 74.5447 25.9995 77.5924L0.53824 7.00727C30.0017 -2.97212 60.7005 -1.32131 87.5434 9.56775L55.5347 77.6985Z" fill="${this.hexToRgbA(this.bgColor, this.bgOpacity)}"/></svg>`;
            slide.innerHTML = `<svg width="123" height="109" viewBox="0 0 118 110" xmlns="http://www.w3.org/2000/svg">
            <path style="cursor:pointer;pointer-events:all;" fill="${this.hexToRgbA(this.bgColor, this.bgOpacity)}" d="M1.13023 19.5189C-0.721016 15.3216 1.32499 10.4138 5.68677 8.99285C39.174 -1.91673 76.03 -3.11266 111.808 7.3664C116.166 8.64298 118.371 13.4111 116.728 17.6453L83.2027 104.081C81.7157 107.915 77.5688 109.947 73.5161 109.25C65.02 107.788 56.4891 107.9 48.2882 109.423C44.3533 110.153 40.2868 108.298 38.6718 104.636L1.13023 19.5189Z"/>
            <defs>
            <linearGradient id="paint0_linear_275_1054" x1="53.5" y1="-9" x2="60.5" y2="120" gradientUnits="userSpaceOnUse">
            <stop stop-color="white" stop-opacity="0.2"/>
            <stop offset="1" stop-color="white" stop-opacity="0.12"/>
            </linearGradient>
            </defs>
            </svg>`
            slide.style.transform = this.styles[index];
            slide.style.position = "absolute";
            slide.style.pointerEvents = "none";

            slide.addEventListener("click", (event) => {
                try {
                    if (event.target.parentNode.parentNode) {
                        var index = event.target.parentNode.parentNode.getAttribute("id").split("_")[1];
                        var currActiveIndex = this.activeSlide.id;
                        if (currActiveIndex - index >= 6) {
                            var times = 8 - (currActiveIndex - index);
                            while (times > 0) {
                                this.next();
                                times--;
                            }
                        }
                        else if (currActiveIndex - index <= -6) {
                            var times = 8 + currActiveIndex - index;
                            while (times > 0) {
                                this.prev();
                                times--;
                            }
                        }
                        else {
                            while (index < currActiveIndex) {
                                this.prev();
                                index++;
                            }
                            while (index > currActiveIndex) {
                                this.next();
                                index--;
                            }
                        }

                    }
                    this.pause();
                }
                catch { }
            })

            //create image
            var image = document.createElement("img");
            image.src = this.fullArray[index];
            image.style = "width: 60%; height: auto;position: absolute; left: 18%; top: 8%;cursor:pointer;";
            slide.appendChild(image);
            slideMiddle.appendChild(slide);
            this.firstSlide = {
                id: 0,
                index: 0,
            }
            this.lastSlide = {
                id: 6,
                index: 6,
            }

            var previewImage = this.shadowRoot.querySelector("#previewImage");
            previewImage.style = `width: ${this.width}; height: ${this.height}; border-radius: ${this.previewBorderRadius}px;`;
            previewImage.src = this.images[this.activeSlide.index];
        })

        this.autoPlay();

    }



    hexToRgbA = (hex, alpha) => {
        if (!hex) {
            return "rgba(0, 0, 0, 0)";
        }
        else if (hex.includes("rgba")) {
            return hex;
        }
        else if (hex.includes("rgb")) {
            return "rgba(" + hex.split("(")[1].split(")")[0] + "," + alpha + ")";
        }
        else if (hex.includes("#")) {
            var c;
            if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
                c = hex.substring(1).split('');
                if (c.length == 3) {
                    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
                }
                c = '0x' + c.join('');
                return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
            }
            throw new Error('Bad Hex');
        }
        else {
            return hex;
        }

    }



    //create prev function
    prev = () => {
        this.currSlide++;
        this.currAngle += 45;
        if (this.currSlide > 7) {
            this.currSlide = 0;
        }

        this.firstSlide.id--;
        if (this.firstSlide.id < 0) {
            this.firstSlide.id = this.fullArray.length - 1;
        }

        this.firstSlide.index--;
        if (this.firstSlide.index < 0) {
            this.firstSlide.index = 7;
        }

        this.lastSlide.id--;
        if (this.lastSlide.id < 0) {
            this.lastSlide.id = this.fullArray.length - 1;
        }

        this.lastSlide.index--;
        if (this.lastSlide.index < 0) {
            this.lastSlide.index = 7;
        }

        this.activeSlide.index--;
        if (this.activeSlide.index < 0) {
            this.activeSlide.index = this.fullArray.length - 1;
        }


        //for top slide to move back to original position
        var prevMiddle = this.shadowRoot.querySelector("#slideMiddle_" + this.activeSlide.id);
        prevMiddle.style.transition = "all 0.5s ease-in-out";
        prevMiddle.style.transform = `translate(-50%, -50%) rotate(0deg)`;

        var firstChild = this.shadowRoot.querySelector("#slide_" + this.firstSlide.index);
        firstChild.children[1].src = this.fullArray[this.firstSlide.id];

        var middlePoint = this.shadowRoot.querySelector(".middlePoint");
        middlePoint.style.transition = "all 0.5s ease-in-out";
        middlePoint.style.transform = `translate(-50%, -50%) rotate(${this.currAngle}deg)`;

        this.activeSlide.id--;
        if (this.activeSlide.id < 0) {
            this.activeSlide.id = 7;
        }

        var currMiddle = this.shadowRoot.querySelector("#slideMiddle_" + this.activeSlide.id);
        currMiddle.style.transition = "all 0.5s ease-in-out";
        currMiddle.style.transform = this.transforms[this.activeSlide.id];

        var previewImage = this.shadowRoot.querySelector("#previewImage");
        //fade in effect
        previewImage.style.transition = "all 0.5s ease-in-out";
        previewImage.style.opacity = 0;
        setTimeout(() => {
            previewImage.src = this.images[this.activeSlide.index];
            previewImage.style.opacity = 1;
        }, 500);

    }

    //create next function
    next = () => {
        this.currSlide--;
        this.currAngle -= 45;
        if (this.currSlide < 0) {
            this.currSlide = 7;
        }

        this.firstSlide.id++;
        if (this.firstSlide.id > this.fullArray.length - 1) {
            this.firstSlide.id = 0;
        }

        this.firstSlide.index++;
        if (this.firstSlide.index > 7) {
            this.firstSlide.index = 0;
        }

        this.lastSlide.id++;
        if (this.lastSlide.id > this.fullArray.length - 1) {
            this.lastSlide.id = 0;
        }

        this.lastSlide.index++;
        if (this.lastSlide.index > 7) {
            this.lastSlide.index = 0;
        }

        this.activeSlide.index++;
        if (this.activeSlide.index > (this.fullArray.length - 1)) {
            this.activeSlide.index = 0;
        }

        //for top slide to move back to original position
        var prevMiddle = this.shadowRoot.querySelector("#slideMiddle_" + this.activeSlide.id);
        prevMiddle.style.transition = "all 0.5s ease-in-out";
        prevMiddle.style.transform = `translate(-50%, -50%) rotate(0deg)`;

        var lastChild = this.shadowRoot.querySelector("#slide_" + this.lastSlide.index);
        lastChild.children[1].src = this.fullArray[this.lastSlide.id];

        var middlePoint = this.shadowRoot.querySelector(".middlePoint");
        middlePoint.style.transition = "all 0.5s ease-in-out";
        middlePoint.style.transform = `translate(-50%, -50%) rotate(${this.currAngle}deg)`;

        this.activeSlide.id++;
        if (this.activeSlide.id > 7) {
            this.activeSlide.id = 0;
        }

        var currMiddle = this.shadowRoot.querySelector("#slideMiddle_" + this.activeSlide.id);
        currMiddle.style.transition = "all 0.5s ease-in-out";
        currMiddle.style.transform = this.transforms[this.activeSlide.id];
        var previewImage = this.shadowRoot.querySelector("#previewImage");
        //fade in effect
        previewImage.style.transition = "all 0.5s ease-in-out";
        previewImage.style.opacity = 0;
        setTimeout(() => {
            previewImage.src = this.images[this.activeSlide.index];
            previewImage.style.opacity = 1;
        }, 500);

    }

    //pause autoplay for 5 seconds
    pause = () => {
        if (this.autoInterval) {
            clearInterval(this.autoInterval);
        }
        if (this.timeOut) {
            clearTimeout(this.timeOut);
        }
        this.timeOut = setTimeout(() => {
            this.autoPlay();
        }, 5000);
    }
}

window.customElements.define('donut-carousel', DonutCarousel);