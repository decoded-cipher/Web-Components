const template = document.createElement('template');
template.innerHTML = `
    <div class="xray-container" style="display: flex; flex-direction: row; overflow: hidden; position: relative;">
`;

class Xray extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.shadow.appendChild(template.content.cloneNode(true));
        
        this.xrayContainer = this.shadow.querySelector('.xray-container');

        this.startSlideIndex = 0;
        this.endSlideIndex = 0;
        this.fullArray = [];
    }


    
    connectedCallback() {

        var thumbnails = JSON.parse(this.getAttribute('thumbnails'));
        var previews = JSON.parse(this.getAttribute('previews'));

        for (var i = 0; i < previews.length; i++) {
            this.fullArray.push({
                preview: previews[i],
                thumbnail: thumbnails[i]
            });
        }
        
        var slidesToShow = this.getAttribute('slidesToShow');
        
        this.autoplay = this.getAttribute('autoplay') || "false";
        this.autoplayDirection = this.getAttribute('autoplayDirection') == 'left' ? 'left' : 'right';

        this.autoplayInterval = this.getAttribute('autoplayInterval') || 3000;
        if (this.autoplayInterval < 10) {
            this.autoplayInterval = this.autoplayInterval * 1000;
        }
        
        this.xrayContainer.style.width = this.getAttribute('width') == 'auto' ? 'auto' : this.getAttribute('width') + 'px';
        this.xrayContainer.style.height = this.getAttribute('height') == 'auto' ? 'auto' : this.getAttribute('height') + 'px';

        this.getAttribute('xRayDirection') == 'vertical' ? this.xrayContainer.style.flexDirection = 'column' : this.xrayContainer.style.flexDirection = 'row';


        this.previewPosition = this.getAttribute('previewPosition') || 'top';
        switch (this.previewPosition) {
            case 'top':
                this.xrayContainer.style.alignItems = 'flex-end';
                break;
            case 'center':
                this.xrayContainer.style.alignItems = 'center';
                break;
            case 'bottom':
                this.xrayContainer.style.alignItems = 'flex-start' ;
                break;
        }

        
        var previewSlides = this.fullArray.slice(0, slidesToShow);
        for (var i = 0; i < previewSlides.length; i++) {
            this.generateSlide(previewSlides[i], i, 'next');
            this.endSlideIndex = i;
            console.log('start: ' + this.startSlideIndex + ' end: ' + this.endSlideIndex);
        }


        document.addEventListener('keydown', (event) => {
            const keyName = event.key;
            if (keyName === 'ArrowRight' || keyName === 'ArrowDown') {
                this.next();
            }
            if (keyName === 'ArrowLeft' || keyName === 'ArrowUp') {
                this.prev();
            }
        })


        if (this.autoplay == "true") {
            setInterval(() => {

                if (this.xrayContainer.matches(':hover')) {
                    return;
                }

                if (this.autoplayDirection == "left") {
                    this.next();
                } else {
                    this.prev();
                }
            }, this.autoplayInterval);
        }

    }



    generateSlide = (data, i, keypress) => {
        var slide = document.createElement('div');
        slide.classList.add('slide');
        slide.id = "slide-" + (i+1);
        slide.setAttribute('style', `margin: 0 10px`);
    
        var thumbnail = document.createElement('img');
        thumbnail.src = data.thumbnail;
        thumbnail.id = "thumbnail-" + (i+1) ;
        
        var preview = document.createElement('img');
        preview.src = data.preview;
        preview.id = "preview-" + (i+1);
        
        if(keypress == 'next') {
            slide.appendChild(thumbnail);
            this.xrayContainer.appendChild(slide);
        } else if (keypress == 'prev') {
            slide.appendChild(thumbnail);
            this.xrayContainer.insertBefore(slide, this.xrayContainer.firstChild);
        }
        

        slide.addEventListener('mouseenter', () => {
            slide.innerHTML = '';
            slide.appendChild(preview);
        });

        slide.addEventListener('mouseleave', () => {
            slide.innerHTML = '';
            slide.appendChild(thumbnail);
        });

    }



    next = () => {

        if (this.endSlideIndex == this.fullArray.length - 1) {
            this.endSlideIndex = 0;
            this.startSlideIndex++
        } else if (this.startSlideIndex == this.fullArray.length - 1) {
            this.startSlideIndex = 0;
            this.endSlideIndex++
        } else {
            this.startSlideIndex++;
            this.endSlideIndex++;
        }

        var nextSlide = this.fullArray[this.endSlideIndex];
        this.generateSlide(nextSlide, this.endSlideIndex, 'next');
        console.log('start: ' + this.startSlideIndex + ' end: ' + this.endSlideIndex);

        var firstSlide = this.shadow.querySelector('.slide');
        this.xrayContainer.removeChild(firstSlide);

    }

    prev = () => {

        if (this.startSlideIndex == 0) {
            this.startSlideIndex = this.fullArray.length - 1;
            this.endSlideIndex--;
        } else if (this.endSlideIndex == 0) {
            this.endSlideIndex = this.fullArray.length - 1;
            this.startSlideIndex--;
        } else {
            this.startSlideIndex--;
            this.endSlideIndex--;
        }

        var prevSlide = this.fullArray[this.startSlideIndex];
        this.generateSlide(prevSlide, this.startSlideIndex, 'prev');
        console.log('start: ' + this.startSlideIndex + ' end: ' + this.endSlideIndex);

        var lastSlide = this.shadow.querySelector('.slide:last-child');
        this.xrayContainer.removeChild(lastSlide);
    }



}


window.customElements.define('adctv-xray', Xray);