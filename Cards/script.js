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

            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }

        h3 {
            font-size: 1.25rem;
            margin: 0 0 1rem 0;
        }

        #dp-image {
            width: 100px;
            height: 100px;
            border-radius: 50%;
        }

        .content {
            margin: auto;
        }

    </style>
            
    <div class="card">
        <div class="image">
            <img id="dp-image"/>
        </div>
        <div class="content">
            <h3 id="title"></h3>
            <p id="description"></p>
        </div>
    </div>
    
    `;

class CardComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true)); 
    }

    connectedCallback() {
        this.shadowRoot.querySelector('#title').innerText = JSON.parse(this.getAttribute('data')).title;
        this.shadowRoot.querySelector('#title').style.color = JSON.parse(this.getAttribute('data')).color;
        this.shadowRoot.querySelector('#description').innerText = JSON.parse(this.getAttribute('data')).description;
        this.shadowRoot.querySelector('#dp-image').src = JSON.parse(this.getAttribute('data')).image;
    }
}

window.customElements.define('my-cards', CardComponent);