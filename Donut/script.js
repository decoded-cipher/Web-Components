const template = document.createElement('template');
template.innerHTML = `
    <div class="donut-carousal"></div>
    <div class="donut-thumbs"></div>
`;


class DonutCarousel extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.appendChild(template.content.cloneNode(true));
    }


    slickCarousal = (image, type) => {

        var donutCarousal = this.shadow.querySelector('.donut-carousal');
        var donutThumbs = this.shadow.querySelector('.donut-thumbs');

        var div = document.createElement('div');
        var img = document.createElement('img');

        // div.classList.add('slide');
        img.src = image;
        
        if(type == 'slide') {
            div.classList.add('__slide_image__');
            div.appendChild(img);
            donutCarousal.appendChild(div);
        } else {
            div.classList.add('__thumbnail_image__');
            div.innerHTML = `
                <svg width="118" height="110" viewBox="0 0 118 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_i_438_2919)">
                    <path d="M1.13999 19.5189C-0.711251 15.3216 1.33476 10.4138 5.69654 8.99285C39.1837 -1.91673 76.0398 -3.11267 111.818 7.3664C116.176 8.64298 118.381 13.4111 116.738 17.6453L83.2125 104.081C81.7254 107.915 77.5785 109.947 73.5259 109.25C65.0297 107.788 56.4989 107.9 48.2979 109.423C44.3631 110.153 40.2966 108.298 38.6815 104.636L1.13999 19.5189Z" fill="#4D4D4D"/>
                    </g>
                    <defs>
                    <filter id="filter0_i_438_2919" x="0.45752" y="0.125" width="116.824" height="112.455" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="5"/>
                    <feGaussianBlur stdDeviation="1.5"/>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_438_2919"/>
                    </filter>
                    </defs>
                </svg>  
            `;
            div.appendChild(img);
            donutThumbs.appendChild(div);
        }

    }


    connectedCallback() {

        var images = JSON.parse(this.getAttribute('images'));
        var thumbs = JSON.parse(this.getAttribute('thumbnails'));
        console.log(thumbs);

        images.forEach((image, index) => {
            this.slickCarousal(image, 'slide');
            this.slickCarousal(thumbs[index], 'thumb');
        });



        var slickCSS = document.createElement('link');
        slickCSS.setAttribute("rel", 'stylesheet');
        slickCSS.setAttribute("type", "text/css");
        slickCSS.setAttribute("href", 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css');
        this.shadow.appendChild(slickCSS);

        var slickThemeCSS = document.createElement('link');
        slickThemeCSS.setAttribute('rel', 'stylesheet');
        slickThemeCSS.setAttribute("type", "text/css");
        slickThemeCSS.setAttribute("href", 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css');
        this.shadow.appendChild(slickThemeCSS);

        var donutCarousalCSS = document.createElement('link');
        donutCarousalCSS.setAttribute('rel', 'stylesheet');
        donutCarousalCSS.setAttribute("type", "text/css");
        donutCarousalCSS.setAttribute("href", 'style.css');
        this.shadow.appendChild(donutCarousalCSS);

        var donutCarousal = this.shadow.querySelector('.donut-carousal');
        var donutThumbs = this.shadow.querySelector('.donut-thumbs');

        $(donutCarousal).slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: donutThumbs
        });
        $(donutThumbs).slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: donutCarousal,
            dots: false,
            centerMode: true,
            focusOnSelect: true
        });
    }
}

window.customElements.define('donut-carousal', DonutCarousel);