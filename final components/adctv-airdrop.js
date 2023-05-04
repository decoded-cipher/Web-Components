const template = document.createElement("template");
template.innerHTML = `
    <div class="airdrop-container">
        <div class="airdrop" style="display: flex; justify-content: space-around; position: absolute; bottom: 10px;"></div>
    </div>
`;

class Airdrop extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "closed" });
        this.shadow.appendChild(template.content.cloneNode(true));
        this.airdrop = this.shadow.querySelector(".airdrop");

        this.moving = false;
        this.boxLeft = 0;
        this.boxPos = {};
        this.points = 0;
        this.mainInterval = [];
    }


    connectedCallback() {

        this.items = this.getImagesFromUrls(this.getAttribute("airdrop-objects"));
        this.objectSize = this.getAttribute("airdrop-objectSize") ? parseInt(this.getAttribute("airdrop-objectSize")) : "auto";
        
        this.collectBox = this.getAttribute("airdrop-collectBox");
        this.collectBoxSize = this.getAttribute("airdrop-collectBoxSize") ? parseInt(this.getAttribute("airdrop-collectBoxSize")) : "auto";

        this.backgroundImage = this.getAttribute("airdrop-backgroundImage");
        this.dropPattern = this.getAttribute("airdrop-dropPattern");

        this.airdropWidth = this.clientWidth ? this.clientWidth : 300;
        this.airdropHeight = this.clientHeight ? this.clientHeight : 600;

        this.autoplay = this.hasAttribute("airdrop-autoplay") ? this.getAttribute("airdrop-autoplay") : false;
        this.collapseAfter = this.hasAttribute("airdrop-collapseAfter") ? this.getAttribute("airdrop-collapseAfter") : false;

        this.airdrop.style = `width: ${this.airdropWidth}px; height: ${this.airdropHeight}px;background-repeat: round; background-size: cover;position: relative;`;

        this.generateAirdrop();

        if (this.autoplay == "true") {
            this.startAirDrop();
        }

        this.airdrop.addEventListener("click", () => {
            this.moving = !this.moving;
        });


        this.airdrop.addEventListener("mousemove", (e) => {
            if (this.moving) {
                var x = e.movementX;
                this.boxLeft += x;
                this.boxPos = this.box.getBoundingClientRect();
                if (this.boxLeft <= 0) {
                    this.boxLeft = 0;
                }
                if((this.boxLeft+this.boxPos.width) >= this.airdropWidth){
                    this.boxLeft = this.airdropWidth - (this.boxPos.width+10);
                }

                this.box.style.left = `${this.boxLeft}px`;
            }
        });

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
                detail: this.shadow.querySelector(".airdrop-container"),
                bubbles: true,
                cancelable: false,
                composed: true,
            });
            this.dispatchEvent(event);
        }
    }


    getImagesFromUrls(images) {
        if(!images || images == "") return [];
        let imagesList = images.split(",");
        let slides = [];
        for (let i = 0; i < imagesList.length; i++) {
            slides.push(decodeURIComponent(imagesList[i]));
        }
        return slides;
    }



    generateAirdrop() {
        this.airdrop.style.backgroundImage = `url('${this.backgroundImage}')`;

        this.box = document.createElement("div");
        this.box.id = "box";
        this.box.style = `width:${this.collectBoxSize}px; height: ${this.collectBoxSize}px; border-radius: 10px; position: absolute; bottom: 5px; left: 0;background-repeat: round; background-size: cover;`;

        var img = document.createElement("img");
        img.src = this.collectBox;
        img.style = "width: 100%; height: auto; position: absolute; z-index:10";

        this.box.appendChild(img);
        this.airdrop.appendChild(this.box);
        this.boxPos = {
            top: parseInt(getComputedStyle(this.box).top),
            left: parseInt(getComputedStyle(this.box).left),
            width: parseInt(getComputedStyle(this.box).width),
            height: parseInt(getComputedStyle(this.box).height)
        }

    }



    startAirDrop() {
        this.fallObject(0);
    }


    collapseAnimation() {
        var halfHeight = this.airdrop.getBoundingClientRect().height / 2;
        this.airdrop.style.height = `${halfHeight}px`;
        this.airdrop.style.transition = "all 0.5s ease-in-out";
        this.airdrop.style.position = "absolute";
        this.airdrop.style.bottom = "0px";
    }



    fallObject(index) {
        var object = document.createElement("div");
        object.id = "item_" + index;
        object.style = `width: ${this.objectSize}px; height: ${this.objectSize}px; border-radius: 50%; position: absolute; top: 0; left: 0;background-repeat: round; background-size: cover;`;
        object.style.backgroundImage = `url('${this.items[index]}')`;
        this.airdrop.appendChild(object);

        object.style.transition = this.dropPattern == "One-by-One" ? "all 2s ease-in-out" : "all 3s ease-in-out";
        object.style.left = `${Math.floor(Math.random() * (this.airdropWidth - 50))}px`;


        // var rotateAngle = Math.floor(Math.random() * 90) - 45;
        setTimeout(() => {
            object.style.transition = "all 3s ease-in-out";
            object.style.top = `${this.airdropHeight}px`;
        }, 100);



        if (this.dropPattern == "Random") {
            index++;
            if (index < this.items.length) {
                var delay = Math.floor(Math.random() * 500) + 1000;
                setTimeout(() => {
                    this.fallObject(index);
                }, delay);
            }
        }


        //check if object is in box
        this.mainInterval[index] = setInterval(() => {
            var objectPos = {
                top: parseInt(getComputedStyle(object).top),
                bottom: parseInt(getComputedStyle(object).top) + (this.objectSize/2),
                left: parseInt(getComputedStyle(object).left),
                right: parseInt(getComputedStyle(object).left) + (this.objectSize)
            }
            var boxPos ={
                top: parseInt(getComputedStyle(this.box).top),
                bottom: parseInt(getComputedStyle(this.box).top) + (this.collectBoxSize/2),
                left: parseInt(getComputedStyle(this.box).left),
                right: parseInt(getComputedStyle(this.box).left) + (this.collectBoxSize)
            }
            //check if object is in box
            if (objectPos.bottom >= boxPos.top) {
                if (objectPos.left >= boxPos.left && objectPos.right <= boxPos.right) {
                    clearInterval(this.mainInterval[index]);
                    console.log("Caught item " + index + "!");
                    object.style.display = "none";
                    object.remove();
                    this.addToBox(index);

                    this.points++;
                    this.triggerEvents(this.points);

                    if (index == (this.items.length-1)) {
                        this.gameOverEvent(this.points);

                        if (this.collapseAfter == "true") {
                            this.collapseAnimation();
                        }
                    }

                    if (this.dropPattern == "One-by-One") {
                        index++;
                        if (index < this.items.length) {
                            this.fallObject(index);
                        } else {
                            clearInterval(this.mainInterval[index]);
                        }
                    }
                }

            }
            //check if object is out of screen
            if (objectPos.top >= this.airdropHeight) {
                clearInterval(this.mainInterval[index]);
                console.log("Missed item " + index + "!");
                object.style.display = "none";

                if (index == (this.items.length-1)) {
                    this.gameOverEvent(this.points);
                    
                    if (this.collapseAfter == "true") {
                        this.collapseAnimation();
                    }
                }

                if (this.dropPattern == "One-by-One") {
                    index++;

                    if (index < this.items.length) {
                        this.fallObject(index);
                    } else {
                        clearInterval(this.mainInterval[index]);
                    }
                }
            }

        }, 100);
    }

    addToBox(index) {
        var item = document.createElement("div");
        item.id = "item_" + index;
        item.style = `width: 50px; height: 50px; border-radius: 50%; position: absolute; top: -20%; left: 0;background-repeat: round; background-size: cover;`;
        //randomize left position
        item.style.left = `${Math.floor(Math.random() * (this.boxPos.width - 50))}px`;
        item.style.backgroundImage = `url('${this.items[index-1]}')`;
        item.style.display = "block";
        //add item to box
        this.box.appendChild(item);

    }






    // ------------------------------------ EVENTS ------------------------------------ //

    triggerEvents(points) {
        if (points == Math.floor(this.items.length / 2)) {
            // trigger event
            this.dispatchEvent(new CustomEvent("half-score", {
                detail: {
                    points: points
                }
            }));
        } else if (points == (this.items.length)) {
            // trigger event
            this.dispatchEvent(new CustomEvent("full-score", {
                detail: {
                    points: points
                }
            }));
        }
        else if (points == 1) {
            // trigger event
            this.dispatchEvent(new CustomEvent("first-score", {
                detail: {
                    points: points
                }
            }));
        }
    }

    gameOverEvent(points) {
        // trigger event
        this.dispatchEvent(new CustomEvent("game-over", {
            detail: {
                points: points
            }
        }));
    }

    

}

window.customElements.define("adctv-airdrop", Airdrop);