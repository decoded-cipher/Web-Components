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
    }


    
    connectedCallback() {
        
        var thumbnails = JSON.parse(this.getAttribute('xray-thumbnails'));
        var previews = JSON.parse(this.getAttribute('xray-previews'));

        this.xrayWrapper.style.width = this.getAttribute('xray-width') === 'auto' ? '100%' : this.getAttribute('xray-width') + 'px';
        this.xrayWrapper.style.height = this.getAttribute('xray-height') === 'auto' ? '100%' : this.getAttribute('xray-height') + 'px';

        this.slidesToShow = this.getAttribute('xray-slidesToShow');
        this.autoplay = this.getAttribute('xray-autoplay') === 'True' ? true : false;
        this.autoplayInterval = this.getAttribute('xray-autoplayInterval') > 1000 ? this.getAttribute('xray-autoplayInterval') : this.getAttribute('xray-autoplayInterval') * 1000;

        
        for (var i = 0; i < thumbnails.length; i++) {
            this.data.push({
                thumbnail: thumbnails[i],
                preview: previews[i]
            });
        }
    
        this.data.forEach((item) => {
            this.slideCard(item);
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 37 || e.keyCode === 38) {
                this.prev();
            } else if (e.keyCode === 39 || e.keyCode === 40) {
                this.next();
            }
        });
        
        
        $(this.xrayContainer).slick({
            infinite: true,
            slidesToShow: this.slidesToShow,
            slidesToScroll: 1,
            autoplay: this.autoplay,
            autoplaySpeed: this.autoplayInterval,
        });
        


        // ---------------- Adding Slick CSS ----------------
        
        var slickCSS = document.createElement('link');
        slickCSS.setAttribute("rel", 'stylesheet');
        slickCSS.setAttribute("type", "text/css");
        slickCSS.setAttribute("href", '/assets/css/slick.css');
        this.shadow.appendChild(slickCSS);

        var slickThemeCSS = document.createElement('link');
        slickThemeCSS.setAttribute('rel', 'stylesheet');
        slickThemeCSS.setAttribute("type", "text/css");
        slickThemeCSS.setAttribute("href", '/assets/css/slick-theme.css');
        this.shadow.appendChild(slickThemeCSS);
        
    }


    slideCard = (item) => {
        
        var slide = document.createElement('div');
        slide.classList.add('slide');
    
        var thumbnail = document.createElement('img');
        thumbnail.src = item.thumbnail;
        slide.appendChild(thumbnail);
        this.xrayContainer.appendChild(slide);

        var preview = document.createElement('img');
        preview.src = item.preview;

        slide.addEventListener('mouseenter', () => {
            slide.innerHTML = '';
            slide.appendChild(preview);
        });
        
        slide.addEventListener('mouseleave', () => {
            slide.innerHTML = '';
            slide.appendChild(thumbnail);
        });
    }


    prev = () => {
        $(this.xrayContainer).slick('slickPrev');
    }

    next = () => {
        $(this.xrayContainer).slick('slickNext');
    }
    
}


window.customElements.define('adctv-xray', Xray);