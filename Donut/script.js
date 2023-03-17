const template = document.createElement('template');
template.innerHTML = `
    <div class="donut-carousal"></div>
`;


class DonutCarousel extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    slideCard = (image) => {
        
        var donutCarousal = this.shadowRoot.querySelector('.donut-carousal');
        var slide = document.createElement('div');
        slide.classList.add('slide');
    
        var img = document.createElement('img');
        img.src = image;
        slide.appendChild(img);
        donutCarousal.appendChild(slide);

    }

    connectedCallback() {

        var images = JSON.parse(this.getAttribute('thumbnail'));
        // console.log(images);

        images.forEach(image => {
            this.slideCard(image);
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

        var donutCarousal = this.shadowRoot.querySelector('.donut-carousal');
        $(donutCarousal).slick({
            centerMode: true,
            centerPadding: '60px',
            slidesToShow: 3,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '40px',
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '40px',
                        slidesToShow: 1
                    }
                }
            ]
        });
    }
}

window.customElements.define('donut-carousal', DonutCarousel);