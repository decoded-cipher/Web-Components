const template = document.createElement('template');
template.innerHTML = `
    <div class="emojiBar__container">
        <div class="emojiBar__emoji" style="display: flex; justify-content: space-around; position: absolute; bottom: 10px;"></div>
    </div>
`;

class EmojiBar extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.shadow.appendChild(template.content.cloneNode(true));

        this.emojiBar = this.shadow.querySelector('.emojiBar__emoji');
        
        this.modernEmoji = ["/assets/modern/1.svg", "/assets/modern/2.svg", "/assets/modern/3.svg", "/assets/modern/4.svg", "/assets/modern/5.svg", "/assets/modern/6.svg", "/assets/modern/7.svg"];
        this.classicEmoji = ["/assets/classic/1.svg", "/assets/classic/2.svg", "/assets/classic/3.svg", "/assets/classic/4.svg", "/assets/classic/5.svg", "/assets/classic/6.svg", "/assets/classic/7.svg"];

    }
    
    connectedCallback() {

        this.emojiType = this.getAttribute('emojiBar__type');
        this.backgroundColor = this.getAttribute('emojiBar__backgroundColor');
        this.backgroundOpacity = this.getAttribute('emojiBar__bgOpacity');
        
        this.emojiBar.style.width = this.getAttribute('emojiBar__width');
        this.emojiBar.style.height = this.getAttribute('emojiBar__height');
        this.emojiBar.style.borderRadius = this.getAttribute('emojiBar__borderRadius');
        this.emojiBar.style.padding = this.getAttribute('emojiBar__padding');

        this.emojiSize = this.getAttribute('emojiBar__emojiSize');
        this.intensity = this.getAttribute('emojiBar__intensity');


        switch (this.emojiType) {
            case 'modern':
                this.emojiArray = this.modernEmoji;
                break;
            case 'classic':
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
                this.generateBubbles(emoji, this.intensity);
            });

        }

    }


    hexToRgbA = (value, alpha) => {

        if (value.includes('rgb')) {
            return value.replace(')', `, ${alpha})`).replace('(', 'a(');
        }

        let hex = value.replace('#', '');
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);

        let result = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
        return result;
    }


    bubbleAnimation = (emoji) => {
            
        let emojiSrc = emoji.src;
        let emojiSize = emoji.style.width;

        let emojiClone = document.createElement('img');
        emojiClone.src = emojiSrc;
        emojiClone.style = `width: ${emojiSize}; height: ${emojiSize}; position: absolute; top: ${emoji.offsetTop}px; left: ${emoji.offsetLeft}px; z-index: 999; transform: translate(18%, 580px);`;
        
        // this.shadowRoot.appendChild(emojiClone);
        this.shadow.appendChild(emojiClone);

        // ----------------------------------

        let randomX = Math.floor(Math.random() * 500) - 250;
        let randomScale = Math.random() * 2;
        let randomAngle = Math.floor(Math.random() * 90) - 45;

        setInterval(() => {
            emojiClone.style.transform = 'translate(' + randomX + 'px, 0px) scale(' + randomScale + ')' + 'rotate(' + randomAngle + 'deg)';
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


    generateBubbles = (emoji, intensity) => {
        
        switch (intensity) {
            case 'low':
                for (let i = 0; i < 1; i++) {
                    this.bubbleAnimation(emoji);
                }
                break;
            case 'medium':
                for (let i = 0; i < 3; i++) {
                    this.bubbleAnimation(emoji);
                }
                break;
            case 'high':
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