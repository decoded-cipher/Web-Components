const template = document.createElement('template');
template.innerHTML = `
    <div class="popup-container">
        <div class="sidenav" style="height: 500px; width: 50px; position: fixed; z-index: 1; top: 0; left: 0; background-color: rgba(0,0,0,0.5); overflow: hidden; transition: 0.5s; border-radius: 0px 0px 20px 0px;">

            <slot></slot>
        
            </div>
        <div class="main" style="margin-left: 50px; transition: margin-left .5s; padding: 0px; margin-top: 100px;">
            <button class="openbtn" style="font-size: 20px; cursor: pointer; background-color: rgba(0,0,0,0.5); color: white; padding: 10px 15px; border: none; border-radius: 0px 50px 50px 0px;">☰</button>
        </div>
    </div>
`;

class PopUp extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.appendChild(template.content.cloneNode(true));

        this.sidebar = false;
    }
    

    connectedCallback() {

        this.message = this.getAttribute('message') || 'Test Hint Message Here ...';
        this.sidebar ? this.openNav() : this.closeNav();

        this.shadow.querySelector('.openbtn').addEventListener('click', () => {
            if (this.sidebar) {
                this.sidebar = false;
                this.closeNav();
            } else {
                this.sidebar = true;
                this.openNav();
            }
        });

    }

    openNav() {
        console.log("open");

        this.shadow.querySelector('.sidenav').innerHTML = this.innerHTML;

        this.shadow.querySelector('.sidenav').style.width = "250px";
        this.shadow.querySelector('.main').style.marginLeft = "250px";
        this.shadow.querySelector('.openbtn').innerHTML = "X";
    }

    closeNav() {
        console.log("close");

        this.shadow.querySelector('.sidenav').innerHTML = `<div style="height: 100%; width: 100%; display: flex; flex-direction: column; justify-content: center;"><p style="white-space: nowrap;
        transform: rotate(-90deg);">${this.message}</p></div>`;

        this.shadow.querySelector('.sidenav').style.width = "50px";
        this.shadow.querySelector('.main').style.marginLeft = "50px";
        this.shadow.querySelector('.openbtn').innerHTML = "☰";
    }

}

window.customElements.define('adctv-popup', PopUp);