const template = document.createElement('template');
template.innerHTML = `
    <div class="xray-wrapper" style="position: relative; overflow: hidden;">
        <div class="xray-container"></div>
    </div>
`;

class Xray extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.shadow.appendChild(template.content.cloneNode(true));

        this.xrayWrapper = this.shadow.querySelector('.xray-wrapper');
        this.xrayContainer = this.shadow.querySelector('.xray-container');

        this.slidesToShow = 3;
        this.autoplay = "false";
        this.autoplayInterval = 1000;
        this.data = [];
        this.timeOut = null;
        this.startSlide = 0;
        this.endSlide = 0;
    }

    getFilesFromUrls(files) {
        if (!files) {
            return;
        }
        let images = files.split(",");
        let slides = [];
        for (let i = 0; i < images.length; i++) {
            slides.push(decodeURIComponent(images[i]));
        }
        return slides;
    }



    connectedCallback() {
        let thumbnailList = this.getAttribute('xray-thumbnails');
        var thumbnails = this.getFilesFromUrls(thumbnailList);

        let previewList = this.getAttribute('xray-previews');
        var previews = this.getFilesFromUrls(previewList);

        // this.xrayWrapper.style.width = this.getAttribute('xray-width') === 'auto' ? '100%' : this.getAttribute('xray-width') + 'px';
        // this.xrayWrapper.style.height = this.getAttribute('xray-height') === 'auto' ? '100%' : this.getAttribute('xray-height') + 'px';
        this.xrayWrapper.style.width = this.clientWidth + 'px';
        this.xrayWrapper.style.height = this.clientHeight + 'px';

        this.xrayContainer.style = `display: flex;width: fit-content;position: relative;transition: all 0.5s ease-in-out;width: inherit;height: inherit;`;
        this.xrayContainer.style
        this.transformPos = 0;

        this.slideWidth = this.getAttribute('xray-slideWidth') ? parseInt(this.getAttribute('xray-slideWidth')) : 200;
        this.slideHeight = this.getAttribute('xray-slideHeight') ? parseInt(this.getAttribute('xray-slideHeight')) : 200;
        this.slideGap = this.getAttribute('xray-slideGap') ? parseInt(this.getAttribute('xray-gap')) : 10;

        this.slidesToShow = this.getAttribute('xray-slidesToShow');
        this.slidesToShow = this.slidesToShow? parseInt(this.slidesToShow) : 3;
        this.autoplay = this.getAttribute('xray-autoplay') === 'True' ? true : false;
        this.autoplayInterval = this.getAttribute('xray-autoplayInterval') ? parseInt(this.getAttribute('xray-autoplayInterval')) : 1000;
        this.endSlide = this.slidesToShow - 1;

        for (var i = 0; i < thumbnails.length; i++) {
            this.data.push({
                thumbnail: thumbnails[i],
                preview: previews[i]
            });
        }

        this.finalArray = this.data.slice(0, this.slidesToShow);

        this.generateSlides();

        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 37 || e.keyCode === 38) {
                this.prev();
                this.pause();
            } else if (e.keyCode === 39 || e.keyCode === 40) {
                this.next();
                this.pause();
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
                detail: this.shadow.querySelector(".xray-wrapper"),
                bubbles: true,
                cancelable: false,
                composed: true,
            });
            this.dispatchEvent(event);
        }
    }


    generateSlides = () => {
        var left = 0;
        this.finalArray.forEach((item, index) => {
            var newSlide = this.buildSlide(left, index);
            this.xrayContainer.appendChild(newSlide);
            left += (this.slideWidth + this.slideGap);
        });
        this.autoplayFn();
    }


    prev = () => {
        if (this.timeOut) return;
        this.startSlide--;
        this.endSlide--;
        if (this.startSlide < 0) this.startSlide = this.data.length - 1;
        if (this.endSlide < 0) this.endSlide = this.data.length - 1;
        this.transformPos += (this.slideWidth + this.slideGap);
        var firstChild = this.xrayContainer.firstElementChild;
        var lastChild = this.xrayContainer.lastElementChild;
        var left = firstChild.style.left;
        left = parseInt(left) - (this.slideWidth + this.slideGap);
        var newSlide = this.buildSlide(left, this.startSlide);
        this.xrayContainer.insertBefore(newSlide, firstChild);
        this.xrayContainer.style.transform = 'translateX(' + this.transformPos + 'px)';
        this.timeOut = setTimeout(() => {
            this.xrayContainer.removeChild(lastChild);
            this.timeOut = null;
        }, 500);

    }

    next = () => {
        if (this.timeOut) return;
        this.startSlide++;
        this.endSlide++;
        if (this.startSlide > this.data.length - 1) this.startSlide = 0;
        if (this.endSlide > this.data.length - 1) this.endSlide = 0;
        this.transformPos -= (this.slideWidth + this.slideGap);
        var firstChild = this.xrayContainer.firstElementChild;
        var lastChild = this.xrayContainer.lastElementChild;
        var left = lastChild.style.left;
        left = parseInt(left) + (this.slideWidth + this.slideGap);
        var newSlide = this.buildSlide(left, this.endSlide);
        this.xrayContainer.appendChild(newSlide);
        this.xrayContainer.style.transform = 'translateX(' + this.transformPos + 'px)';
        this.timeOut = setTimeout(() => {
            this.xrayContainer.removeChild(firstChild);
            this.timeOut = null;
        }, 500);
    }

    buildSlide = (left, index = 0) => {
        var newSlide = document.createElement('div');
        newSlide.classList.add('xray-slide');
        newSlide.style = 'width:' + this.slideWidth + 'px;height:' + this.slideHeight + 'px;margin-right:10px;position:absolute;transition:all 0.5s ease-in-out;bottom:0;left:' + left + 'px;cursor:pointer;';
        //create thumbnail
        var newImg = document.createElement('img');
        newImg.src = this.data[index].thumbnail;
        newImg.style = 'width:100%;height:100%;object-fit:contain;position:absolute;bottom:0;left:0;';
        newSlide.appendChild(newImg);

        //create preview
        var newPreview = document.createElement('img');
        newPreview.classList.add('xray-preview');
        newPreview.src = this.data[index].preview;
        newPreview.style = 'width:fit-content;height:auto;object-fit:cover;position:absolute;bottom:0;left:0;transition:all 0.5s ease-in-out;display:none;opacity:0;';
        // display:none;opacity:0;
        newSlide.appendChild(newPreview);

        newSlide.addEventListener('mouseenter', () => {
            newPreview.style.display = 'block';
            setTimeout(() => {
                newPreview.style.opacity = 1;
            }, 100);
        });

        newSlide.addEventListener('mouseleave', () => {
            newPreview.style.opacity = 0;
            setTimeout(() => {
                newPreview.style.display = 'none';
            }, 500);
        });

        return newSlide;
    }

    autoplayFn = () => {
        if(this.autoplay == true){
            this.autoInterval = setInterval(() => {
                this.next();
            }, this.autoplayInterval);
        }
    }

    //pause autoplay for 5 seconds
    pause = () => {
        if(this.autoInterval){
            clearInterval(this.autoInterval);
        }
        if(this.pauseTimeOut){
            clearTimeout(this.pauseTimeOut);
        }
        this.pauseTimeOut = setTimeout(() => {
            this.autoplayFn();
        }, 5000);
    }



}


window.customElements.define('adctv-xray', Xray);