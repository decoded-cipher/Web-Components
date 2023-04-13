const template = document.createElement('template');
template.innerHTML = `
    <div class="spin-container">
        <svg viewBox="0 0 110 110" id="circle"></svg>
    </div>
`;

class Spin extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
        this.shadow.appendChild(template.content.cloneNode(true));

        this.startAngle = 0;
        this.circle = this.shadow.querySelector('#circle');
        
        this.bgColor = [
            { "color_1" : "#106E74", "color_2" : "#00F0FF" },
            { "color_1" : "#09598C", "color_2" : "#33ADFA" },
            { "color_1" : "#56149F", "color_2" : "#A55CF7" },
            { "color_1" : "#830CA5", "color_2" : "#E17AFE" },
            { "color_1" : "#931632", "color_2" : "#F6083E" },
            { "color_1" : "#950A47", "color_2" : "#FD0271" },
            { "color_1" : "#9C2908", "color_2" : "#FF5929" },
            { "color_1" : "#A07808", "color_2" : "#F7C949", }
        ];
    }


    
    connectedCallback() {

        this.slices = this.getAttribute('slices');
        this.size = this.getAttribute('size');
        this.strokeWidth = this.getAttribute('stroke-width');
        this.strokeColor = this.getAttribute('stroke-color');
        this.fillType = this.getAttribute('fill-type');
        
        this.circle.style.width = this.size + 'px';
        this.circle.style.height = this.size + 'px';

        this.offers = JSON.parse(this.getAttribute('offers'));
        this.breakPoint = this.getAttribute('break-point');
        this.centerOffset = this.getAttribute('center-offset');

        this.fontFamily = this.getAttribute('font-family');
        this.fontColor = this.getAttribute('font-color');
        this.fontSize = this.getAttribute('font-size');
        this.fontWeight = this.getAttribute('font-weight');
        this.fontStyle = this.getAttribute('font-style');

        this.spinCount = this.getAttribute('spin-count');
        this.centerOffset = this.getAttribute('center-offset') / 10;

        this.createCircle(55, 55, 50, this.slices);
        
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 13 || e.keyCode === 32) {

                this.startAngle += 360 * this.spinCount + (360 / this.slices) * Math.floor(Math.random() * this.slices) + (360 / this.slices) / 2;
                // this.circle.style.animation = "rotation 5s linear infinite";
                this.circle.style.transform = 'rotate(' + this.startAngle + 'deg)';
                this.circle.style.transition = 'transform 5s ease-in-out';

            }
        });

    }
    

    
    createCircle = (cx, cy, r, slices) => {
        
        var fromAngle, toAngle, fromCoordX, fromCoordY, toCoordX, toCoordY, path, d;

        for (var i = 0; i < slices; i++) {
            
            path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.style.stroke = this.strokeColor;
            path.style.strokeWidth = this.strokeWidth;

            // path.style.fill = this.bgColor[i].color_2;
            this.setFillColors(path, i);

            fromAngle = i * 360 / slices;
            toAngle = (i + 1) * 360 / slices;
            // console.log(fromAngle + ' ' + toAngle);

            fromCoordX = cx + (r * Math.cos(fromAngle * Math.PI / 180));
            fromCoordY = cy + (r * Math.sin(fromAngle * Math.PI / 180));
            toCoordX = cx + (r * Math.cos(toAngle * Math.PI / 180));
            toCoordY = cy + (r * Math.sin(toAngle * Math.PI / 180));
            // console.log(fromCoordX + ' ' + fromCoordY + ' ' + toCoordX + ' ' + toCoordY);
            
            d = 'M' + cx + ',' + cy + ' L' + fromCoordX + ',' + fromCoordY + ' A' + r + ',' + r + ' 0 0,1 ' + toCoordX + ',' + toCoordY + 'z';
            // console.log(d);
            
            path.setAttributeNS(null, "d", d);
            this.circle.appendChild(path);

            // calculate the center of the slice and add the text
            var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            var textAngle = (fromAngle + toAngle) / 2;
            var textCoordX = cx + (r * Math.cos(textAngle * Math.PI / 180)) / this.centerOffset;
            var textCoordY = cy + (r * Math.sin(textAngle * Math.PI / 180)) / this.centerOffset;

            // roate the text to the center of the slice
            text.setAttributeNS(null, "transform", "rotate(" + textAngle + " " + textCoordX + " " + textCoordY + ")");

            this.setContent(text, i, textCoordX, textCoordY);
            this.circle.appendChild(text);
        }
    }

    

    setFillColors = (path, i) => {
        var gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");

        gradient.setAttributeNS(null, "id", "gradient" + i);
        gradient.setAttributeNS(null, "x1", "0%");
        gradient.setAttributeNS(null, "y1", "0%");
        gradient.setAttributeNS(null, "x2", "100%");
        gradient.setAttributeNS(null, "y2", "100%");
        
        var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop1.setAttributeNS(null, "offset", "0%");
        stop1.setAttributeNS(null, "stop-color", this.bgColor[i].color_2);
        
        var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop2.setAttributeNS(null, "offset", "100%");
        stop2.setAttributeNS(null, "stop-color", this.fillType == 'solid' ? this.bgColor[i].color_2 : this.bgColor[i].color_1);  
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        
        this.circle.appendChild(gradient);
        path.style.fill = "url(#gradient" + i + ")";
    }



    setContent = (text, i, textCoordX, textCoordY) => {

        if (this.offers[i].length > this.breakPoint) {
            
            var text1 = this.offers[i].substring(0, this.breakPoint);
            var tspan1 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            this.setSpanAttributes(tspan1, text1, textCoordX, textCoordY - 3);
            text.appendChild(tspan1);
            
            var text2 = this.offers[i].substring(this.breakPoint, this.offers[i].length);
            var tspan2 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            this.setSpanAttributes(tspan2, text2, textCoordX, textCoordY + 3);
            text.appendChild(tspan2);

        } else {
            var tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            this.setSpanAttributes(tspan, this.offers[i], textCoordX, textCoordY);
            text.appendChild(tspan);
        }

    }



    setSpanAttributes = (span, text, textCoordX, textCoordY) => {
        span.setAttributeNS(null, "x", textCoordX);
        span.setAttributeNS(null, "y", textCoordY);

        span.setAttributeNS(null, "text-anchor", "middle");
        span.setAttributeNS(null, "dominant-baseline", "central");
        
        span.setAttributeNS(null, "font-family", this.fontFamily);
        span.setAttributeNS(null, "font-size", this.fontSize);
        span.setAttributeNS(null, "font-weight", this.fontWeight);
        span.setAttributeNS(null, "font-style", this.fontStyle);
        span.setAttributeNS(null, "fill", this.fontColor);
        span.textContent = text;
    }


    
}


window.customElements.define('adctv-spinner', Spin);