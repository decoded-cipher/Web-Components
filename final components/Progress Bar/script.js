"use strict";
// last modified:28-03-23 11:20
class AdctvProgress extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.label = "Test";
    }
    connectedCallback() {
        this.initAttributes();
        this.progress = document.createElement("progress");
        this.progress.innerHTML = this.label;
        this.progressWidth = this.clientWidth || 300;
        this.progressHeight = this.clientHeight || 20;
        var color = this.getAttribute("color")||"black";
        var bgcolor = this.getAttribute("bg-color")||"grey";
        var borderRadius = this.getAttribute("border-radius")|| 10;
        this.maxValue = this.getAttribute("max-value")?parseInt(this.getAttribute("max-value")):100;
        this.startValue = this.getAttribute("start-value")?parseInt(this.getAttribute("start-value")):0;
        this.progress.style =`width:${this.progressWidth}px;height:${this.progressHeight}px;`;
        this.progress.value = this.startValue;
        this.progress.max = this.maxValue;
        this.animationTime = this.getAttribute("animation-time")?parseInt(this.getAttribute("animation-time")):0.5;

        var style = document.createElement('style');
                
        style.innerHTML = `progress {-webkit-appearance: none;appearance: none;transition:all ${this.animationTime}s ease-in-out;}progress::-webkit-progress-bar {background-color: ${bgcolor};border-radius: ${borderRadius}px;height: ${this.progressHeight}px;transition:all ${this.animationTime}s ease-in-out;}progress::-webkit-progress-value {background-color: ${color};border-radius: ${borderRadius}px;height: ${this.progressHeight}px;transition:all ${this.animationTime}s ease-in-out;}`;

        this.shadow.appendChild(style);
        
  
        this.shadow.appendChild(this.progress);        
        
        setTimeout(() => {
            this.emitLoadedEvent();
        }, 100);
    }
    disconnectedCallback() {
        this.shadow.innerHTML = "";
    }

    
    emitLoadedEvent() {
        if (window.__adctvScreenShot == true) {
            let event = new CustomEvent("loaded", {
                detail: this.shadow.querySelector(".donutCarousel"),
                bubbles: true,
                cancelable: false,
                composed: true,
            });
            this.dispatchEvent(event);
        }
    }

    switchProgress(value){
        this.progress.value = value;
    }


    static getObservedAttributes() { }
    attributeChangedCallback() { }
    initAttributes() {
        this.label = this.getAttribute("label") || this.label;
    }
}
customElements.define("adctv-progress", AdctvProgress);