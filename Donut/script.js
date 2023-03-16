const template = document.createElement('template');
template.innerHTML = `
    
    `;

class DonutCarousel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true)); 
    }

    connectedCallback() {
        
    }
}

window.customElements.define('DonutCarousel', DonutCarousel);