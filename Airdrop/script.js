const template = document.createElement("template");
template.innerHTML = `
    <div class="airdrop-container">
        <div class="airdrop" style="display: flex; justify-content: space-around; position: absolute; bottom: 10px;"></div>
    </div>
`;

class Airdrop extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: "closed"});
        this.shadow.appendChild(template.content.cloneNode(true));
        this.airdrop = this.shadow.querySelector(".airdrop");

        this.moving = false;
        this.boxLeft = 0;
        this.boxPos = {};
        this.points = 0;
    }


    connectedCallback() {

        this.items = JSON.parse(this.getAttribute("airdrop-objects"));
        this.backgroundImage = this.getAttribute("airdrop-backgroundImage");
        this.collectBox = this.getAttribute("airdrop-collectBox");
        this.dropPattern = this.getAttribute("airdrop-dropPattern");

        this.airdropWidth = this.getAttribute("airdrop-width") ? parseInt(this.getAttribute("airdrop-width")) : 100;
        this.airdropHeight = this.getAttribute("airdrop-height") ? parseInt(this.getAttribute("airdrop-height")) : 100;

        this.airdrop.style = `width: ${this.airdropWidth}px; height: ${this.airdropHeight}px;background-repeat: round; background-size: cover;position: relative;`;

        this.generateAirdrop();

        this.airdrop.addEventListener("click", () => {
            this.moving = !this.moving;
        });


        this.airdrop.addEventListener("mousemove", (e) => {
            if (this.moving) {
                var x = e.movementX;
                this.boxLeft += x;
                this.boxPos = this.box.getBoundingClientRect();
                if (this.boxPos.left <= 0) {
                    this.boxLeft = 0;
                }
                if (this.boxPos.right >= (this.airdropWidth + 10)) {
                    this.boxLeft = this.airdropWidth - (this.boxPos.width);
                }
                this.box.style.left = `${this.boxLeft}px`;
            }
        });

    }



    generateAirdrop() {
        this.airdrop.style.backgroundImage = `url('${this.backgroundImage}')`;

        this.box = document.createElement("div");
        this.box.id = "box";
        this.box.style = "width:100px; height: 100px; border-radius: 10px; position: absolute; bottom: 5px; left: 0;background-repeat: round; background-size: cover;";

        var img = document.createElement("img");
        img.src = this.collectBox;
        img.style = "width: 100%; height: 100%;position: absolute;z-index:10";

        this.box.appendChild(img);
        this.airdrop.appendChild(this.box);
        this.boxPos = this.box.getBoundingClientRect();

        this.startAirDrop();
    }



    startAirDrop() {
        this.fallObject(0);
    }


    
    fallObject(index) {
        var object = document.createElement("div");
        object.id = "item_" + index;
        object.style = "width: 50px; height: 50px; border-radius: 50%; position: absolute; top: 0; left: 0;background-repeat: round; background-size: cover;";
        object.style.backgroundImage = `url('${this.items[index]}')`;
        this.airdrop.appendChild(object);

        object.style.transition = this.dropPattern == "One-by-One" ? "all 2s ease-in-out" : "all 3s ease-in-out";
        object.style.left = `${Math.floor(Math.random() * (this.airdropWidth - 50))}px`;

         
        // var rotateAngle = Math.floor(Math.random() * 90) - 45;
        setTimeout(() => {
            object.style.transition = "all 3s ease-in-out";
            // object.style.transform = `rotate(${rotateAngle}deg)`
            object.style.top = `${this.airdropHeight}px`;
        }, 100);



        if(this.dropPattern == "Random"){
            index++;
            if (index < this.items.length) {
                var delay = Math.floor(Math.random() * 500) + 1000;
                setTimeout(() => {
                    this.fallObject(index);
                }, delay);
            }
        }
        
        
        //check if object is in box
        this.mainInterval = setInterval(() => {
            var objectPos = object.getBoundingClientRect();
            //check if object is in box
            if (objectPos.bottom >= this.boxPos.top) {

                if (objectPos.left >= this.boxPos.left && objectPos.right <= this.boxPos.right) {
                    console.log("Caught item " + index + "!");
                    object.style.display = "none";
                    object.remove();
                    this.addToBox(index);
                    
                    this.points++;
                    this.triggerEvents(this.points);
                    
                    if(this.dropPattern == "One-by-One"){
                        index++;
                        if (index < this.items.length) {
                            this.fallObject(index);
                        } else {
                            clearInterval(this.mainInterval);
                        }
                    }
                }

            }
            //check if object is out of screen
            if (objectPos.top >= this.airdropHeight) {
                console.log("Missed item " + index + "!");
                object.style.display = "none";
                
                if(this.dropPattern == "One-by-One"){
                    index++;
                    if (index < this.items.length) {
                        this.fallObject(index);
                    } else {
                        clearInterval(this.mainInterval);
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
        item.style.backgroundImage = `url('${this.items[index]}')`;
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
                    points : points
                }
            }));
        } else if (points == this.items.length) {
            // trigger event
            this.dispatchEvent(new CustomEvent("full-score", {
                detail: {
                    points : points
                }
            }));
        }
        else if (points == 1) {
            // trigger event
            this.dispatchEvent(new CustomEvent("first-score", {
                detail: {
                    points : points
                }
            }));
        }

    }



}

window.customElements.define("adctv-airdrop", Airdrop);