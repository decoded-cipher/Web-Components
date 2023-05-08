const template = document.createElement('template');
template.innerHTML = `
    <div class="popup-container"></div>
`;

class PopUp extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.appendChild(template.content.cloneNode(true));

        this.popupContainer = this.shadow.querySelector('.popup-container');
        this.sidebar = false;
    }
    

    connectedCallback() {

        this.openIcon = this.getAttribute('popup_openIcon') || "https://ads.adctv.com/assets/creatives/pop_up/open.png";
        this.closeIcon = this.getAttribute('popup_closeIcon') || "https://ads.adctv.com/assets/creatives/pop_up/close.png";
        this.bgColor = this.getAttribute('popup_bgColor');
        this.drawSide = this.getAttribute('popup_drawSide');
        
        this.width = this.clientWidth;
        this.height = this.clientHeight;
        
        this.message = this.getAttribute('popup_hint');
        this.messageColor = this.getAttribute('popup_hintColor');
        
        var leftSVG = `<svg id="bg_image" style="top: 0px; transition: left .5s; left: -230px; height: inherit; width: 320px; z-index: -10; position: fixed;" xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 548.000000 863.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,863.000000) scale(0.100000,-0.100000)" fill="${this.bgColor}" stroke="none"><path d="M0 4365 l0 -4265 2100 0 c1517 0 2114 3 2152 11 81 17 157 61 216 123 70 74 104 149 109 240 3 39 5 1374 6 2966 l2 2895 23 57 c32 79 99 150 178 189 52 26 83 34 159 40 114 10 161 22 239 61 156 79 259 237 272 418 22 285 -215 539 -502 540 -115 0 -242 65 -304 154 -63 93 -64 97 -68 484 l-3 352 -2290 0 -2289 0 0 -4265z"/></g></svg>`
        var rightSVG = `<svg xmlns="http://www.w3.org/2000/svg" id="bg_image" style="top: 0px; transition: right .5s; right: -230px; height: inherit; width: 320px; z-index: -10; position: fixed;" viewBox="0 0 731 1151" fill="none"><g clip-path="url(#clip0_63_4237)"><path d="M730.667 568.667V1137.33H450.667C248.4 1137.33 168.8 1136.93 163.733 1135.87C152.933 1133.6 142.8 1127.73 134.933 1119.47C125.6 1109.6 121.067 1099.6 120.4 1087.47C120 1082.27 119.733 904.267 119.6 692L119.333 306L116.267 298.4C112 287.867 103.067 278.4 92.5334 273.2C85.6 269.733 81.4667 268.667 71.3334 267.867C56.1334 266.533 49.8667 264.933 39.4667 259.733C18.6667 249.2 4.93338 228.133 3.20004 204C0.26671 166 31.8667 132.133 70.1334 132C85.4667 132 102.4 123.333 110.667 111.467C119.067 99.0668 119.2 98.5334 119.733 46.9334L120.133 0.000103444H425.467H730.667V568.667Z" fill="${this.bgColor}"/></g><defs><clipPath id="clip0_63_4237"><rect width="730.667" height="1150.67" fill="white" transform="matrix(-1 0 0 1 730.667 0)"/></clipPath></defs></svg>`
        
        this.popupContainer.innerHTML = `
            ${this.drawSide == "Left" ? leftSVG : rightSVG}

            <div class="main">
                <button class="openbtn" style="font-size: 20px; cursor: pointer; border: none; background-color: inherit;">
                </button>
            </div>

            <div style="position: absolute; top: 0px; ${this.drawSide == "Left" ? "left: 0px;" : "right: 0px;"}">
                <div class="sidenav" style="z-index: "100";>
                    <slot></slot>
                </div>
            </div>
        `;

        this.sidebar ? this.openAside() : this.closeAside();

        this.shadow.querySelector('.openbtn').addEventListener('click', () => {
            if (this.sidebar) {
                this.closeAside();
            } else {
                this.openAside();
            }
        });

    }

    openAside() {
        this.triggerEvent(this, 'open');
        
        this.sidebar = true;
        this.shadow.querySelector('.sidenav').innerHTML = `<div id="tagContent" style="opacity:0;">${this.innerHTML}</div>`;

        this.shadow.querySelector('.sidenav').style.width = this.width+"px";
        this.shadow.querySelector('.sidenav').style.height = this.height+"px";

        this.shadow.querySelector('.main').style = `padding: 0px; width: auto; ${this.drawSide == "Left" ? "float: left; transition: margin-left .5s; margin: 62px 0px 0px 258px;" : "float: right; transition: margin-right .5s; margin: 62px 258px 0px 0px;"}`
        this.drawSide == "Left" ? this.shadow.querySelector('#bg_image').style.left = "0px" : this.shadow.querySelector('#bg_image').style.right = "0px";
        this.shadow.querySelector('.openbtn').innerHTML = `<img src="${this.closeIcon}" style="height: 50px; width: 50px;">`;

        setTimeout(() => {
            this.shadow.querySelector('#tagContent').style = "opacity: 1; transition: opacity 0.5s;";
        }, 500);
    }
    
    closeAside() {
        this.triggerEvent(this, 'close');
        
        this.sidebar = false;
        this.shadow.querySelector('.sidenav').innerHTML = `<div id="hint" style="position: absolute; width: 38px; height: 450px; display: flex; flex-direction: column; top: 50px; align-items: center; justify-content: center;"><p style="white-space: nowrap; transform: rotate(${this.drawSide == "Left" ? "-90deg" : "90deg"}); color: ${this.messageColor};">${this.message}</p></div>`;
        
        this.shadow.querySelector('.sidenav').style.width = this.width+"px";
        this.shadow.querySelector('.sidenav').style.height = this.height+"px";

        this.shadow.querySelector('.main').style = `${this.drawSide == "Left" ? "float: left; transition: margin-left .5s; margin: 62px 0px 0px 28px;" : "float: right; transition: margin-right .5s; margin: 62px 28px 0px 0px;"}`;
        this.drawSide == "Left" ? this.shadow.querySelector('#bg_image').style.left = "-230px" : this.shadow.querySelector('#bg_image').style.right = "-230px";
        this.shadow.querySelector('.openbtn').innerHTML = `<img src="${this.openIcon}" style="height: 50px; width: 50px;">`;
    }

    
    // ------------------------------ Custom Events ------------------------------

    triggerEvent(data, event) {
        var event = new CustomEvent(event, {
            detail: data
        });
        this.dispatchEvent(event);
    }

    disconnectedCallback() {
        this.shadow.innerHTML = "";
    }


}

window.customElements.define('adctv-popup', PopUp);