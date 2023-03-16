const template = document.createElement('template');
template.innerHTML = `
    
    <style>
        .card {
            width: 350px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
            padding: 1rem;
            text-align: center;
        }

        h3 {
            font-size: 1.25rem;
            margin: 0 0 1rem 0;
        }

    </style>
            
    <div class="card">
        <h3 name="title"></h3>
        <p name="description"></p>
    </div>
    
    `;

class CardComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true)); 
        
        this.shadowRoot.querySelector('h3').innerText = this.getAttribute('name');
        this.shadowRoot.querySelector('h3').style.color = this.getAttribute('color');
        this.shadowRoot.querySelector('p').innerText = this.getAttribute('designation');
    }
}

window.customElements.define('my-cards', CardComponent);