const template = document.createElement('template');
template.innerHTML = `
    <div class="maze-container">
        <canvas id="myCanvas" ></canvas>
    </div>
`;

class ADCTV_Maze extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.shadow.appendChild(template.content.cloneNode(true));
    }



    connectedCallback() {

        var mazeOptions = {

            bodyColor : this.getAttribute('bodyColor') || '#ffffff',

            size : this.getAttribute('size') || 500,
            mazeColor : this.getAttribute('mazeColor') || '#000000',
            mazeStroke : this.getAttribute('mazeStroke') || 1,

            complexity : this.getAttribute('complexity') || 10,
            showPath : this.hasAttribute('showPath') || false,
            
            trailProcessingColor : this.getAttribute('trailProcessingColor') || "#ff0000",
            trailResultColor : this.getAttribute('trailResultColor') || "#00ff00",
            trailShape : this.getAttribute('trailShape') || "circle",

            animation : this.hasAttribute('animation') || false,
            animationDelay : this.getAttribute('animationDelay') || 100,
        };

        new Maze(this.shadow.getElementById('myCanvas'), mazeOptions);

    }

}



class Maze {
    constructor(canv, options) {

        var nx = options.complexity;
        var ny = options.complexity;
        
        options.width = options.size;
        options.height = options.size;

        console.table(options);


        // to leave movement trails in the maze as we move through it
        this.drawMoia = (x, y, colorbackground, edgecolor) => {
            this.ctx.beginPath();
            this.ctx.rect(this.xTerrain(x) + this.dx / 4, this.yTerrain(y) + this.dy / 4, this.dx / 2, this.dy / 2);
            this.ctx.fillStyle = colorbackground;
            this.ctx.fill();
            this.ctx.lineWidth = 1
            this.ctx.strokeStyle = edgecolor;
            this.ctx.stroke();
        }

        // to show the path finding algorithm in action
        this.drawMoib = (x, y) => {
            this.ctx.beginPath();

            if(options.trailShape == 'circle') {
                this.ctx.arc(this.xTerrain(x) + this.dx / 2, this.yTerrain(y) + this.dy / 2, this.dx / 12, 0, 2 * Math.PI);
            } else {
                this.ctx.rect(this.xTerrain(x) + this.dx / 3, this.yTerrain(y) + this.dy / 3, this.dx / 4, this.dy / 4);
            }

            this.ctx.fillStyle = options.trailProcessingColor;
            
            this.ctx.fill();
            this.ctx.lineWidth = 0;
            this.ctx.strokeStyle = options.trailProcessingColor;
            this.ctx.stroke();
        }

        // to show the result of the path finding algorithm
        this.drawMoic = (x, y) => {
            this.ctx.beginPath();
            
            if(options.trailShape == 'circle') {
                this.ctx.arc(this.xTerrain(x) + this.dx / 2, this.yTerrain(y) + this.dy / 2, this.dx / 12, 0, 2 * Math.PI);
            } else {
                this.ctx.rect(this.xTerrain(x) + this.dx / 3, this.yTerrain(y) + this.dy / 3, this.dx / 4, this.dy / 4);
            }
            
            this.ctx.fillStyle = options.trailResultColor;
            this.ctx.fill();
            this.ctx.lineWidth = 0;
            this.ctx.strokeStyle = options.trailResultColor;
            this.ctx.stroke();
        }
        

        // ------------------------------------------------------------

        
        // remove the movement trails in the maze
        this.remove = () => {
            this.drawMoia(this.xMoi, this.yMoi, options.bodyColor, options.bodyColor);
        }

        // draw the character who moves in the maze
        this.drawMoi = () => {
            this.drawMoia(this.xMoi, this.yMoi, '#000000', '#ffffff');
        }

        // calculate position x left edge of box n
        this.xTerrain = (n) => {
            return this.X0 + n * this.dx;
        }

        // calculate position y upper edge of box n
        this.yTerrain = (n) => {
            return this.Y0 + n * this.dy;
        }


        // ------------------------------------------------------------

        
        // break the wall between the square (x,y) and the square above
        this.breakUp = (x, y) => {
            this.terrain[x][y] &= ~1;
            this.terrain[x][y - 1] &= ~4;
        }

        // break the wall between the square (x,y) and the square below
        this.breakDown = (x, y) => {
            this.terrain[x][y] &= ~4;
            this.terrain[x][y + 1] &= ~1;
        }

        // break the wall between the square (x,y) and the square on the left
        this.breakLeft = (x, y) => {
            this.terrain[x][y] &= ~2;
            this.terrain[x - 1][y] &= ~8;
        }

        // break the wall between the square (x,y) and the square on the right
        this.breakRight = (x, y) => {
            this.terrain[x][y] &= ~8;
            this.terrain[x + 1][y] &= ~2;
        }


        // ------------------------------------------------------------


        // draw the maze walls on the canvas
        this.drawMaze = () => {
            var x, y;
            for (x = 0; x < this.nx; x++) {
                for (y = 0; y < this.ny; y++) {
                    if ((this.terrain[x][y] & 1) != 0) {
                        this.ctx.beginPath();
                        
                        this.ctx.lineWidth = options.mazeStroke;
                        this.ctx.strokeStyle = options.mazeColor;

                        this.ctx.moveTo(this.xTerrain(x), this.yTerrain(y));
                        this.ctx.lineTo(this.xTerrain(x + 1), this.yTerrain(y));
                        this.ctx.stroke();
                    }
                    if ((this.terrain[x][y] & 2) != 0) {
                        this.ctx.beginPath();

                        this.ctx.lineWidth = options.mazeStroke;
                        this.ctx.strokeStyle = options.mazeColor;
                        
                        this.ctx.moveTo(this.xTerrain(x), this.yTerrain(y));
                        this.ctx.lineTo(this.xTerrain(x), this.yTerrain(y + 1));
                        this.ctx.stroke();
                    }
                }
            }
        }

        // create the maze on the canvas using the Prim's algorithm (randomized version)
        this.createMaze = () => {
            var tbDir = [1, 2, 4, 8];
            // empty the lot
            var xc, yc;
            var rAv = this.nx * this.ny - 1; // number of squares in which to break a wall
            var nvx = 0, nvy = 0, vois = 0, dir;

            for (var kx = 0; kx < this.nx; kx++) {
                this.terrain[kx] = new Array(options.height);
                for (var ky = 0; ky < this.ny; ky++) {
                    this.terrain[kx][ky] = 15;
                }
            }

            // Algorithm:
            // we start from a random box
            // we make the list of neighbors who are not part of the maze
            // if we find one, we draw one and break the wall that separates them
            // and this neighbor becomes the new starting square
            // if we don't find one, we draw a new box that is part of the maze
            // start from a random box again

            xc = Math.floor(Math.random() * this.nx);
            yc = Math.floor(Math.random() * this.ny);

            //    rAv=15;
            while (rAv > 0) {
                vois = 0; // no neighbor
                if (yc > 0 && (this.terrain[xc][yc] & 1) != 0 && this.terrain[xc][yc - 1] == 15) vois |= 1; // possibility to break up
                if (xc > 0 && (this.terrain[xc][yc] & 2) != 0 && this.terrain[xc - 1][yc] == 15) vois |= 2; // possibility to break on the left
                if (yc < this.ny - 1 && (this.terrain[xc][yc] & 4) != 0 && this.terrain[xc][yc + 1] == 15) vois |= 4; // possibility to break down
                if (xc < this.nx - 1 && (this.terrain[xc][yc] & 8) != 0 && this.terrain[xc + 1][yc] == 15) vois |= 8; // possibility to break to the right
                
                if (vois != 0) {
                    // choose a direction randomly among the possible ones
                    do {
                        dir = tbDir[Math.floor(Math.random() * 4)] & vois;
                    } while (dir == 0);
                    
                    switch (dir) {
                        case 1:
                            this.breakUp(xc, yc);
                            yc--;
                            break;
                        case 2:
                            this.breakLeft(xc, yc);
                            xc--;
                            break;
                        case 4:
                            this.breakDown(xc, yc);
                            yc++;
                            break;
                        case 8:
                            this.breakRight(xc, yc);
                            xc++;
                            break;
                    }

                    rAv--;
                } // if we can find a neighbor
                else { // try from another box
                    do {
                        xc = Math.floor(Math.random() * this.nx);
                        yc = Math.floor(Math.random() * this.ny);
                    } while (this.terrain[xc][yc] == 15);
                }
            } // integration of the boxes into the maze
        };


        // ------------------------------------------------------------
        

        this.start = (nx, ny) => {
            this.ctx.clearRect(0, 0, options.width, options.height);

            // taking into account the number of rows and columns
            this.nx = nx;
            this.ny = ny;
            if (this.nx < 3) this.nx = 3;
            if (this.ny < 3) this.ny = 3;
            if (this.nx > 111) this.nx = 111;
            if (this.ny > 80) this.ny = 80;

            this.dx = Math.floor((options.width - 20) / this.nx);
            this.dy = Math.floor((options.height - 20) / this.ny);
            this.X0 = Math.floor((options.width - this.nx * this.dx) / 2) + 0.5
            this.Y0 = Math.floor((options.height - this.ny * this.dy) / 2) + 0.5

            this.ctx.beginPath();
            this.ctx.lineWidth = options.mazeStroke;
            this.ctx.strokeStyle = options.mazeColor;
            this.ctx.rect(this.X0, this.Y0, this.dx * this.nx, this.dy * this.ny);
            this.ctx.stroke();

            if (this.myTimer) {
                clearInterval(this.myTimer); // kills any search in progress
                delete this.myTimer;
            }

            this.terrain = new Array(options.width);
            this.ys = Math.floor(this.ny / 2); // output position: mid-height

            
            // ------------------------------------------------------------

            this.createMaze();
            this.drawMaze();
            
            // ------------------------------------------------------------


            // draw the exit path on the right side of the maze
            this.ctx.beginPath();
            this.ctx.lineWidth = options.mazeStroke * 1.5;
            this.ctx.strokeStyle = options.bodyColor;
            this.ctx.moveTo(this.xTerrain(this.nx), this.yTerrain(this.ys));
            this.ctx.lineTo(this.xTerrain(this.nx), this.yTerrain(this.ys + 1));
            this.ctx.stroke();

            this.xMoi = 0;
            this.yMoi = this.ys;
            this.drawMoi();
            this.resolutionInProgress = false;
            
        }


        // ------------------------------------------------------------


        // recursive search function
        // modified to be called at each setInterval tick
        // otherwise we do not see the progress of the search

        this.continueSearch = () => {

            // we have finished the search
            if (this.tbRech.length == 0) {
                this.tbRech = null;
                this.resolutionInProgress = false;
                this.drawMoi();
                clearInterval(this.myTimer);
                delete this.myTimer;
                return;
            }

            var rechCou = this.tbRech[this.tbRech.length - 1];
            var stage = rechCou.stage;
            var vois = this.terrain[rechCou.x][rechCou.y];

            if (this.tbRech.length == 1) {
                //parent for the beginning of search
                parent = { x: -2, y: -2 };
            } else {
                parent = this.tbRech[this.tbRech.length - 2];
            }

            // start search at this level
            if (stage == 0) {
                
                if(options.animation) {
                    this.drawMoib(rechCou.x, rechCou.y);
                }


                if (rechCou.x == this.nx - 1 && rechCou.y == this.ys) { // we found
                    // let the parent know
                    if (this.tbRech.length > 1) this.tbRech[this.tbRech.length - 2].success = true;
                    
                    // delete to stop search at this level
                    this.tbRech.pop();
                    
                    // redraw it to show the result of the search
                    this.drawMoic(rechCou.x, rechCou.y);
                    return;
                }

                this.tbRech[this.tbRech.length - 1].stage++;
                if (((vois & 8) == 0) && (parent.x != (rechCou.x + 1))) {
                    this.tbRech.push({
                        x: rechCou.x + 1,
                        y: rechCou.y,
                        stage: 0,
                        success: false
                    });
                    return;
                } else stage++;
            }

            // we just tried on one side, we check if it was successful
            if (rechCou.success) {
                
                // let the parent know
                if (this.tbRech.length > 1) {
                    this.tbRech[this.tbRech.length - 2].success = true;
                }

                // delete to stop search at this level
                this.tbRech.pop();
                
                // materialize the studied position
                this.drawMoic(rechCou.x, rechCou.y);
                
                // we do not erase the drawn rectangle when entering
                return; 
            }

            // not on this side, we try another
            if (stage == 1) {
                this.tbRech[this.tbRech.length - 1].stage++;
                if (((vois & 1) == 0) && (parent.y != (rechCou.y - 1))) {
                    this.tbRech.push({
                        x: rechCou.x,
                        y: rechCou.y - 1,
                        stage: 0,
                        success: false
                    });
                    return;
                } else stage++;
            }

            // not on this side, we try another
            if (stage == 2) {
                this.tbRech[this.tbRech.length - 1].stage++;
                if (((vois & 4) == 0) && (parent.y != (rechCou.y + 1))) {
                    this.tbRech.push({
                        x: rechCou.x,
                        y: rechCou.y + 1,
                        stage: 0,
                        success: false
                    });
                    return;
                } else stage++;
            }

            // not on this side, we try another
            if (stage == 3) {
                this.tbRech[this.tbRech.length - 1].stage++;
                if (((vois & 2) == 0) && (parent.x != (rechCou.x - 1))) {
                    this.tbRech.push({
                        x: rechCou.x - 1,
                        y: rechCou.y,
                        stage: 0,
                        success: false
                    });
                    return;
                } else stage++
            }

            // if we are here, it means that we have tried all the sides
            // It's a complete failure. Let's delete and pop
            
            // delete to stop search at this level
            this.tbRech.pop();
            this.drawMoia(rechCou.x, rechCou.y, options.bodyColor, options.bodyColor);
        };


        this.initiateSearch = () => {
            this.tbRech = [{
                x: this.xMoi,
                y: this.yMoi,
                stage: 0,
                success: false
            }];
            this.myTimer = setInterval(((lab) => {
                return () => {
                    lab.continueSearch();
                }
            })(this), options.animation ? options.animationDelay : 1);
        };




        // ------------------  drawing functions --------------------------------

        this.canv = canv;
        options.bodyColor = options.bodyColor
        this.canv.width = options.width
        this.canv.height = options.height;
        this.ctx = this.canv.getContext("2d");
        this.start(nx, ny);

        // Anonyme function to handle key strokes
        ((obj) => {

            document.onkeydown = (keyStroke) => {

                if (keyStroke.defaultPrevented) return; // Already treated
                if (obj.resolutionInProgress) return; // ignore while solving
                
                var x = keyStroke;
                var y = 5;
                var move = 0;
                y = x.key;

                switch (y) {
                    case 'ArrowUp':
                        if ((obj.terrain[obj.xMoi][obj.yMoi] & 1) == 0) {
                            obj.remove();
                            obj.yMoi--;
                            obj.drawMoi();
                            move = 1;
                        }
                        break;
                    case 'ArrowLeft':
                        if ((obj.terrain[obj.xMoi][obj.yMoi] & 2) == 0) {
                            obj.remove();
                            obj.xMoi--;
                            obj.drawMoi();
                            move = 1;
                        }
                        break;
                    case 'ArrowDown':
                        if ((obj.terrain[obj.xMoi][obj.yMoi] & 4) == 0) {
                            obj.remove();
                            obj.yMoi++;
                            obj.drawMoi();
                            move = 1;
                        }
                        break;
                    case 'ArrowRight':
                        if ((obj.terrain[obj.xMoi][obj.yMoi] & 8) == 0) {
                            obj.remove();
                            obj.xMoi++;
                            obj.drawMoi();
                            move = 1;
                        }
                        break;
                    case 's':
                        ;
                    case 'S':
                        ;
                    case 'U+0053':
                        ;
                    case 'U+0073':

                        if(options.showPath) {
                            obj.resolutionInProgress = true;
                            obj.initiateSearch();
                            obj.drawMoi();
                        }
                        break;
                        
                    default:
                        return;
                }
                keyStroke.preventDefault();

                if (move == 1 && obj.xMoi == obj.nx - 1 && obj.yMoi == obj.ys) {
                    setTimeout(() => {
                        alert('Congratulations ! You win !')
                    }, 100);
                }
            };
        })(this);

    }
    
    
}   
    


window.customElements.define('adctv-maze', ADCTV_Maze);