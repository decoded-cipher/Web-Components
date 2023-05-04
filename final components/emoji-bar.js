const template = document.createElement('template');
template.innerHTML = `
    <div class="emojibar-emoji" style="display: flex; justify-content: space-around; position: absolute; bottom: 10px;"></div>
`;

class EmojiBar extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.shadow.appendChild(template.content.cloneNode(true));

        this.emojiBar = this.shadow.querySelector('.emojibar-emoji');
        
        this.modernEmoji = ["https://ads.adctv.com/components/dev/adctv-emoji-bar/modern/1.svg", "https://ads.adctv.com/components/dev/adctv-emoji-bar/modern/2.svg", "https://ads.adctv.com/components/dev/adctv-emoji-bar/modern/3.svg", "https://ads.adctv.com/components/dev/adctv-emoji-bar/modern/4.svg", "https://ads.adctv.com/components/dev/adctv-emoji-bar/modern/5.svg", "https://ads.adctv.com/components/dev/adctv-emoji-bar/modern/6.svg", "https://ads.adctv.com/components/dev/adctv-emoji-bar/modern/7.svg"];
        this.classicEmoji = ["https://ads.adctv.com/components/dev/adctv-emoji-bar/classic/1.svg", "https://ads.adctv.com/components/dev/adctv-emoji-bar/classic/2.svg", "https://ads.adctv.com/components/dev/adctv-emoji-bar/classic/3.svg", "https://ads.adctv.com/components/dev/adctv-emoji-bar/classic/4.svg", "https://ads.adctv.com/components/dev/adctv-emoji-bar/classic/5.svg", "https://ads.adctv.com/components/dev/adctv-emoji-bar/classic/6.svg", "https://ads.adctv.com/components/dev/adctv-emoji-bar/classic/7.svg"];

    }
    
    connectedCallback() {

        this.emojiType = this.getAttribute('emojibar-type');
        this.backgroundColor = this.getAttribute('emojibar-backgroundColor');
        this.backgroundOpacity = this.getAttribute('emojibar-bgOpacity') <= 1 ? this.getAttribute('emojibar-bgOpacity') : this.getAttribute('emojibar-bgOpacity') / 100;
        
        this.emojiBar.style.width = this.clientWidth + "px";
        this.emojiBar.style.height = "auto";
        
        this.emojiBar.style.borderRadius = this.getAttribute('emojibar-borderRadius') + "px";
        this.emojiBar.style.padding = this.getAttribute('emojibar-offsetY') + "px " + this.getAttribute('emojibar-offsetX') + "px";
        this.emojiBar.style.alignItems = "center";
        this.emojiSize = this.getAttribute('emojibar-emojiSize') + "px";
        this.intensity = this.getAttribute('emojibar-intensity');


        switch (this.emojiType) {
            case 'Modern':
                this.emojiArray = this.modernEmoji;
                break;
            case 'Classic':
                this.emojiArray = this.classicEmoji;
                break;
            default:
                break;
        }


        this.emojiBar.style.backgroundColor = this.hexToRgbA(this.backgroundColor, this.backgroundOpacity);
        
        for (let i = 0; i < this.emojiArray.length; i++) {

            let emoji = document.createElement('img');
            emoji.id = `emoji_${i + 1}`;
            emoji.src = this.emojiArray[i];
            emoji.style = `width: ${this.emojiSize}; height: ${this.emojiSize}; cursor: pointer; z-index: 9999`
            this.emojiBar.appendChild(emoji);

            emoji.addEventListener('mouseenter', () => {
                emoji.style.transform = 'scale(1.2)';
                emoji.style.transition = 'all 0.2s ease-in-out';
            });

            emoji.addEventListener('mouseleave', () => {
                emoji.style.transform = 'scale(1)';
                emoji.style.transition = 'all 0.2s ease-in-out';
            });

            emoji.addEventListener('click', () => {
                this.generateBubbles(emoji);
            });

        }

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
                detail: this.shadow.querySelector(".emojibar-emoji"),
                bubbles: true,
                cancelable: false,
                composed: true,
            });
            this.dispatchEvent(event);
        }
    }


    hexToRgbA = (hex, alpha) => {
        if(!hex){
            return "rgba(0, 0, 0, 0)";
        }
        else if(hex.includes("rgba")){
            return hex;
        }
        else if(hex.includes("rgb")){
            return "rgba("+hex.split("(")[1].split(")")[0]+","+alpha+")";
        }
        else if(hex.includes("#")){
            var c;
            if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
                c = hex.substring(1).split('');
                if (c.length == 3) {
                    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
                }
                c = '0x' + c.join('');
                return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
            }
            throw new Error('Bad Hex');
        }
        else{
            return hex;
        }
        
    }


    bubbleAnimation = (emoji) => {
            
        let emojiSrc = emoji.src;
        let emojiSize = emoji.style.width;

        let emojiClone = document.createElement('img');
        emojiClone.src = emojiSrc;
        emojiClone.style = `width: ${emojiSize}; height: ${emojiSize}; position: absolute; top: ${emoji.offsetTop}px; left: ${emoji.offsetLeft}px; z-index: 999; transform: translate(0, 0);`;
        
        // this.shadowRoot.appendChild(emojiClone);
        this.shadow.querySelector('.emojibar-emoji').appendChild(emojiClone);

        // ----------------------------------

        let randomX = Math.floor(Math.random() * 500) - 250;
        let randomScale = Math.random() * 2;
        let randomAngle = Math.floor(Math.random() * 90) - 45;

        setInterval(() => {
            emojiClone.style.transform = 'translate(' + randomX + 'px, -300px) scale(' + randomScale + ')' + 'rotate(' + randomAngle + 'deg)';
            emojiClone.style.transition = 'all 5s ease-in-out';
        }, 100);

        setTimeout(() => {
            emojiClone.style.opacity = '0';
            emojiClone.style.transition = 'all 1s ease-in-out';
        }, 3500);

        // ----------------------------------

        setTimeout(() => {
            emojiClone.remove();
        }, 5000);

    }


    generateBubbles = (emoji) => {
        
        switch (this.intensity) {
            case 'Low':
                for (let i = 0; i < 1; i++) {
                    this.bubbleAnimation(emoji);
                }
                break;
            case 'Medium':
                for (let i = 0; i < 3; i++) {
                    this.bubbleAnimation(emoji);
                }
                break;
            case 'High':
                for (let i = 0; i < 5; i++) {
                    this.bubbleAnimation(emoji);
                }
                break;
            default:
                break;
        }

    }


}

window.customElements.define('emoji-bar', EmojiBar);