const template = document.createElement('template');
template.innerHTML = `
    <div class="spin-container">
        <ul class="circle"></ul>
    </div>
`;

class Spin extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.shadow.appendChild(template.content.cloneNode(true));

        this.startAngle = 0;
        this.bgColor = ['green', 'tomato', 'aqua', 'yellow', 'orange', 'purple', 'cyan', 'brown', 'gray', 'pink', 'maroon', 'gold'];
    }


    
    connectedCallback() {

        var count = this.getAttribute('count');
        
        var circle = this.shadow.querySelector('.circle');
        
        for (var i = 0; i < count; i++) {
            var li = document.createElement('li');
            li.innerHTML = `<div class="text" style="background-color: ${this.bgColor[i]}">${i + 1}</div>`;

            li.style.cssText = `
                -ms-transform : rotate(${this.startAngle}deg) skewY(-60deg);
                transform : rotate(${this.startAngle}deg) skewY(-60deg);
            `;
             
            this.startAngle += 360 / count;
            circle.appendChild(li);
        }











        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', 'style.css');
        this.shadow.appendChild(link);
        
    }

    
}


window.customElements.define('adctv-spin', Spin);