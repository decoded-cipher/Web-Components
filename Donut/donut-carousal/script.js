const template = document.createElement('template');
template.innerHTML = `
    <div class="donutCarousel">
        <div class="imagePreview">
            <img id="previewImage" src="" alt="">
        </div>
        <div class="base" style="width: 250px; height: 175px; position: relative;overflow: hidden;">
            <div class="cartwheel" style="width: 250px;top:50px; height: 250px; background-color: white; border-radius: 50%; position: relative;">
                <div class="middlePoint" style="width: 20px; height: 20px; border-radius: 50%; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);"></div>
            </div>
        </div>
    </div>
`;


class DonutCarousel extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.appendChild(template.content.cloneNode(true));

        this.transforms = [
            `translate(-100%, 0%)`,
            `translate(-100%, -50%)`,
            `translate(-100%, -90%)`,
            `translate(-50%, -100%)`,
            `translate(0%, -100%)`,
            `translate(0%, -50%)`,
            `translate(0%, 0%)`,
            `translate(-50%, 0%)`,
        ]
        this.styles = [
            `translate(-97px, 26px) rotate(226deg)`,
            `translate(-119px, -33px) rotate(270deg)`,
            `translate(-92px, -92px) rotate(315deg)`,
            `translate(-32px, -115px) rotate(0deg)`,
            `translate(27px, -89px) rotate(44deg)`,
            `translate(50px, -27px) rotate(90deg)`,
            `translate(23px, 31px) rotate(135deg)`,
            `translate(-37px, 54px) rotate(180deg)`
        ];
        
        this.firstSlide ={};
        this.lastSlide = {};
        this.activeSlide = 3;
        
        this.currSlide = 0;
        this.currAngle = 0;
        
    }
    
    
    
    
    
    connectedCallback() {
        
        this.images = JSON.parse(this.getAttribute('images'));
        this.fullArray = JSON.parse(this.getAttribute('thumbnails'));
        
        this.bgColor = this.getAttribute('bgColor');
        this.bgOpacity = this.getAttribute('bgOpacity');

        this.width = this.getAttribute('width');
        this.height = this.getAttribute('height');

        this.autoplay = this.getAttribute('autoplay');
        this.autoplayInterval = this.getAttribute('autoplayInterval');
        this.autoplayDirection = this.getAttribute('autoplayDirection');
        
        this.slidesArray = this.fullArray.slice(0, 8);
        console.log(this.slidesArray);

        this.generateSildes();

        // trigget next function and prev function on arrow keys
        document.addEventListener('keydown', (event) => {
            const keyName = event.key;
            if (keyName === 'ArrowRight') {
                this.next();
            }
            if (keyName === 'ArrowLeft') {
                this.prev();
            }
        })


        if (this.autoplay == "true") {
            setInterval(() => {
                if (this.autoplayDirection == "left") {
                    this.next();
                } else {
                    this.prev();
                }
            }, this.autoplayInterval);
        }
        
    }


    generateSildes = () =>{

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
            slide.innerHTML= `<svg width="88" height="78" viewBox="0 0 88 78" xmlns="http://www.w3.org/2000/svg"><path d="M55.5347 77.6985C46.2088 74.7707 35.958 74.5447 25.9995 77.5924L0.53824 7.00727C30.0017 -2.97212 60.7005 -1.32131 87.5434 9.56775L55.5347 77.6985Z" fill="${this.hexToRgbA(this.bgColor, this.bgOpacity)}"/></svg>`;
            slide.style.transform = this.styles[index];
            slide.style.position = "absolute";
            
            //create image
            var image = document.createElement("img");
            image.src = this.fullArray[index];
            image.style = "width: 60%; height: auto;position: absolute; left: 18%; top: 8%;";
            slide.appendChild(image);
            slideMiddle.appendChild(slide);
            this.firstSlide ={
                id: 0,
                index : 0,
            }
            this.lastSlide = {
                id : 6,
                index : 6,
            }

            var previewImage = this.shadowRoot.querySelector("#previewImage");
            previewImage.style = `width: ${this.width}; height: ${this.height};`;
            previewImage.src = this.images[this.activeSlide];
        })

    }



    hexToRgbA = (hex, alpha) => {
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
        }
        throw new Error('Bad Hex');
    }



    //create prev function
    prev = () =>{
        this.currSlide++;
        this.currAngle += 45;
        if(this.currSlide>7){
            this.currSlide = 0;
        }

        this.firstSlide.id--;
        if(this.firstSlide.id<0){
            this.firstSlide.id = this.fullArray.length-1;
        }

        this.firstSlide.index--;
        if(this.firstSlide.index<0){
            this.firstSlide.index = 7;
        }

        this.lastSlide.id--;
        if(this.lastSlide.id<0){
            this.lastSlide.id = this.fullArray.length-1;
        }

        this.lastSlide.index--;
        if(this.lastSlide.index<0){
            this.lastSlide.index = 7;
        }


        //for top slide to move back to original position
        var prevMiddle = this.shadowRoot.querySelector("#slideMiddle_" + this.activeSlide);
        prevMiddle.style.transition = "all 0.5s ease-in-out";     
        prevMiddle.style.transform = `translate(-50%, -50%) rotate(0deg)`;   

        var firstChild = this.shadowRoot.querySelector("#slide_" + this.firstSlide.index);
        firstChild.children[1].src = this.fullArray[this.firstSlide.id];

        var middlePoint = this.shadowRoot.querySelector(".middlePoint");
        middlePoint.style.transition = "all 0.5s ease-in-out";
        middlePoint.style.transform = `translate(-50%, -50%) rotate(${this.currAngle}deg)`;

        this.activeSlide--;
        if(this.activeSlide<0){
            this.activeSlide = 7;
        }
        
        var currMiddle = this.shadowRoot.querySelector("#slideMiddle_" + this.activeSlide);
        currMiddle.style.transition = "all 0.5s ease-in-out";
        currMiddle.style.transform = this.transforms[this.activeSlide];

        var previewImage = this.shadowRoot.querySelector("#previewImage");
        previewImage.src = this.images[this.activeSlide];

        console.log("activeSlide - " + this.activeSlide);
        console.log(currMiddle);
        
    }

    //create next function
    next = () =>{
        this.currSlide--;
        this.currAngle -= 45;
        if(this.currSlide<0){
            this.currSlide = 7;
        }

        this.firstSlide.id++;
        if(this.firstSlide.id>this.fullArray.length-1){
            this.firstSlide.id = 0;
        }

        this.firstSlide.index++;
        if(this.firstSlide.index>7){
            this.firstSlide.index = 0;
        }

        this.lastSlide.id++;
        if(this.lastSlide.id>this.fullArray.length-1){
            this.lastSlide.id = 0;
        }

        this.lastSlide.index++;
        if(this.lastSlide.index>7){
            this.lastSlide.index = 0;
        }

        //for top slide to move back to original position
        var prevMiddle = this.shadowRoot.querySelector("#slideMiddle_" + this.activeSlide);
        prevMiddle.style.transition = "all 0.5s ease-in-out";     
        prevMiddle.style.transform = `translate(-50%, -50%) rotate(0deg)`;   

        var lastChild = this.shadowRoot.querySelector("#slide_" + this.lastSlide.index);
        lastChild.children[1].src = this.fullArray[this.lastSlide.id];

        var middlePoint = this.shadowRoot.querySelector(".middlePoint");
        middlePoint.style.transition = "all 0.5s ease-in-out";
        middlePoint.style.transform = `translate(-50%, -50%) rotate(${this.currAngle}deg)`;

        this.activeSlide++;
        if(this.activeSlide>7){
            this.activeSlide = 0;
        }
        
        var currMiddle = this.shadowRoot.querySelector("#slideMiddle_" + this.activeSlide);
        currMiddle.style.transition = "all 0.5s ease-in-out";
        currMiddle.style.transform = this.transforms[this.activeSlide];

        var previewImage = this.shadowRoot.querySelector("#previewImage");
        previewImage.src = this.images[this.activeSlide];
        
        console.log("activeSlide - " + this.activeSlide);
        console.log(currMiddle);

    }
}

window.customElements.define('donut-carousal', DonutCarousel);