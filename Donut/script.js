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

        var jqueryScript = document.createElement('script');
        jqueryScript.setAttribute('type', 'text/javascript');
        jqueryScript.setAttribute('src', 'https://code.jquery.com/jquery-1.11.0.min.js');
        this.shadow.appendChild(jqueryScript);

        var jqueryMigrate = document.createElement('script');
        jqueryMigrate.setAttribute('type', 'text/javascript');
        jqueryMigrate.setAttribute('src', 'https://code.jquery.com/jquery-migrate-1.2.1.min.js');
        this.shadow.appendChild(jqueryMigrate);

        jqueryMigrate.onload = () => {  
            var slickScript = document.createElement('script');
            slickScript.setAttribute('type', 'text/javascript');
            slickScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js');
            this.shadow.appendChild(slickScript);

            slickScript.onload = () => {
                var slickOptions = document.createElement('script');
                slickOptions.setAttribute('type', 'text/javascript');
                slickOptions.innerHTML = `
                    $(document).ready(() => {
                        $('.donut-carousal').slick({
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
                    });

                `;
                this.shadow.appendChild(slickOptions);
            }
        };
    }
}

window.customElements.define('donut-carousal', DonutCarousel);