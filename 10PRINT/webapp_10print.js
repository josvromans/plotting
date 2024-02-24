// the paper width and height in mm
widthMM = 210;
heightMM = 297;
lineWidthMM = .6;
SQRT2 = Math.sqrt(2);
X=C.getContext('2d');

// to be calculated
MARGIN=0;
SCALE=1;
SCALE = 1;  // to be calculated
PLOT_PATH = '';
o=(x,c)=>`${c} ${r(x[0])} ${r(x[1])} `;  // to convert coordinates
r=n=>Number((n).toFixed(1));
R=v=>Math.random()*v|0;


drawLine=(from, _to)=>{
    // draw a line on the canvas, taking the SCALE into account
    // and also add the line to the SVG path string, rounded
    X.moveTo(MARGIN+from[0]*SCALE,MARGIN+from[1]*SCALE)
    X.lineTo(MARGIN+_to[0]*SCALE,MARGIN+_to[1]*SCALE)
    X.stroke()
    PLOT_PATH+=o(from,'M')+o(_to,'L');
}


drawDottedLine=(start, end, segments)=>{
    let diffX = end[0] - start[0];
    let diffY = end[1] - start[1];
    let stepX = diffX / segments;
    let stepY = diffY / segments;

    for (let i=1; i<segments;i+=2){
        drawLine(
            [start[0]+stepX*i, start[1]+stepY*i],
            [start[0]+stepX*(i+1), start[1]+stepY*(i+1)],
        )
    }
}


calculateScale=_=>{
    windowWidth = window.innerWidth - 220;
    windowHeight = window.innerHeight;
    C.width = W = windowWidth;
    C.height = H = windowHeight;
    MARGIN = H/20;

    let width = windowWidth - 2 * MARGIN;
    let height = windowHeight - 2 * MARGIN;
//    let sideLength  =  parseInt(document.getElementById('paper-width').value);
    let selectedPaper = document.getElementById('paper-type').value;

    if (selectedPaper === 'square'){
        SCALE = Math.min(width,height) / widthMM;
    } else if (selectedPaper === 'a4'){
        if ((height/width)<SQRT2){
            // height is leading, takes screen height
            SCALE = height / heightMM;
        } else {
            // width is leading, width take screen width
            SCALE = width / widthMM;
        }
    }
}


setPaperStyle=_=>{
    let selectedPaper = document.getElementById('paper-type').value;
    let modeElement = document.getElementById('mode');


    if (selectedPaper === 'square'){
        document.getElementById('paper-width').value = 150;

        // if switching to Origami paper, but box2 or box6 was selected, reset it to default
        if (modeElement.value === 'box2' || modeElement.value === 'box6'){
            modeElement.value = 'square';
            modeElement.options[0].selected = true
        }
        //
    } else if (selectedPaper === 'a4') {
        document.getElementById('paper-width').value = 210;
    }

    let isSquare = selectedPaper === 'square';
    modeElement.options[2].disabled=isSquare;
    modeElement.options[3].disabled=isSquare;

    setPaperDimensions();
}


setPaperDimensions=_=>{
    // read the value from the paper width input field,
    // and then set the height and width in MM based on the paper style (a4 or square)
    let selectedPaper = document.getElementById('paper-type').value;
    let paperWidth = parseInt(document.getElementById('paper-width').value);

    widthMM = paperWidth;

    if (selectedPaper === 'square'){
        heightMM = widthMM;
    } else if (selectedPaper === 'a4') {
        heightMM = Math.round(Math.sqrt(2) * widthMM)
    }

//    console.log(widthMM, heightMM);
    drawPaper();
}


drawPaper=_=>{
    calculateScale();

    X.fillStyle = '#aae';
    X.fillRect(0,0,W,H)

    X.fillStyle = 'white';
    X.fillRect(MARGIN,MARGIN, widthMM*SCALE,heightMM*SCALE)
}


drawCube=(xStart, yStart, dimensionMM)=>{

    if (document.getElementById('dots-only').checked){
        return drawGrid(xStart, yStart, dimensionMM)
    }

    let gridSize = parseInt(document.getElementById('items').value);
    let one4th = dimensionMM/4;
    let three4th = one4th*3;
    let step=(dimensionMM/2)/gridSize;

    for(y=gridSize;y--;){
        for(x=gridSize;x--;){
            U=R(2);
            f=[xStart+ x*step+one4th, yStart+(y+U)*step+one4th];
            t=[xStart+ (x+1)*step+one4th,yStart+(y+(U+1)%2)*step+one4th];

            drawLine(f,t);

//            P+=o(f,'M')+o(t,'L');
//            X.moveTo(xStart+f[0]*SCALE,yStart+f[1]*SCALE),
//            X.lineTo(xStart+t[0]*SCALE,yStart+t[1]*SCALE),
//            X.stroke()
        }
    }
}
drawGrid=(xStart, yStart, dimensionMM)=>{
    let gridSize = parseInt(document.getElementById('items').value);
    let one4th = dimensionMM/4;
    let step=(dimensionMM/2)/gridSize;

    X.fillStyle='black';
    lineWidthMM = document.getElementById('line-width').value;
    let dotSize = lineWidthMM * SCALE;

    let halfSize = dotSize / 2;
    for(y=gridSize+1;y--;){
        for(x=gridSize+1;x--;){
            let xco = xStart+ x*step+one4th;
            let yco = yStart+y*step+one4th;

            X.fillRect(
                MARGIN + xco * SCALE - halfSize,
                MARGIN + yco * SCALE - halfSize, dotSize,dotSize);

            PLOT_PATH+=o([xco, yco-lineWidthMM/4],'M') + o([xco, yco+lineWidthMM/4],'L');
        }
    }
}

drawHelpLines=data=>{
    let isA4 = document.getElementById('paper-type').value === 'a4';
    let drawCuttingLines = document.getElementById('draw-cutting-lines').checked;
    if (isA4 && drawCuttingLines){
        X.lineWidth /= 6;
        data.forEach(d=>drawDottedLine(...d))
    }
}

generate=_=>{
    PLOT_PATH = '';
    setPaperDimensions();

    lineWidthMM = document.getElementById('line-width').value;
    X.lineWidth = lineWidthMM * SCALE;

    let isA4 = document.getElementById('paper-type').value === 'a4';
    console.log(isA4, ' is is A4')
    let modeElement = document.getElementById('mode');
    let mode = modeElement.value;
    let drawCuttingLines = document.getElementById('draw-cutting-lines').checked;

    if (mode==='box'){
        drawCube(0,0, widthMM)

        drawHelpLines([[[0,widthMM], [widthMM,widthMM], 45]])
    } else if (mode === 'box2'){
        let halfway = heightMM/2;
        drawCube(0,0, halfway);
        drawCube(0, halfway,  halfway);

        drawHelpLines([
            [[0,halfway], [widthMM,halfway], 45],
            [[halfway, 0], [halfway, heightMM], 65]
        ])
    } else if (mode === 'box6'){
        let v1 = heightMM/3;
        let v2 = v1*2;

        drawCube(0,0, v1)
        drawCube(0, v1,  v1)
        drawCube(0,v2, v1)
        drawCube(v1, 0,  v1)
        drawCube(v1,v1, v1)
        drawCube(v1, v2,  v1)

        drawHelpLines([
            [[0,v1], [v2,v1], 45],
            [[0,v2], [v2,v2], 45],
            [[v1,0], [v1,heightMM], 65],
            [[v2,0], [v2,heightMM], 65],
        ])
    } else {
        // mode is full screen
        let gridSize = parseInt(document.getElementById('items').value);

        let gridSizeY = gridSize;  // same for square paper
        if (isA4){
            gridSizeY = ~~(gridSize*SQRT2)
        }

        let margin = widthMM/70;
        let stepX=(widthMM-2*margin)/gridSize;
        let stepY=(heightMM-2*margin)/gridSizeY;

        let xStart = margin;
        let yStart = margin;

        if (!document.getElementById('dots-only').checked){
            for(y=gridSizeY;y--;){
                for(x=gridSize;x--;){
                    U=R(2);
                    f=[xStart+ x*stepX, yStart+(y+U)*stepY];
                    t=[xStart+ (x+1)*stepX,yStart+(y+(U+1)%2)*stepY];

                    drawLine(f,t);
                }
            }
        } else {
            X.fillStyle='black';
            lineWidthMM = document.getElementById('line-width').value;
            let dotSize = lineWidthMM * SCALE;
            let halfSize = dotSize / 2;

            for(y=gridSizeY+1;y--;){
                for(x=gridSize+1;x--;){
                    let xco = xStart+ x*stepX;
                    let yco = yStart+y*stepY;

                    X.fillRect(MARGIN + xco * SCALE, MARGIN + yco * SCALE, dotSize, dotSize);
                    PLOT_PATH+=o([xco, yco-lineWidthMM/4],'M') + o([xco, yco+lineWidthMM/4],'L');
                }
            }
        }

    }
}

downloadSVG=_=>{
  let a = document.createElement('a');
  let e = new MouseEvent('click');
  a.download = '10print.svg';
  a.href = 'data:text/html;base64,'+btoa(unescape(`<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${widthMM} ${heightMM}"
  width="${widthMM}mm"
  height="${heightMM}mm"
>
<path d="${PLOT_PATH}" fill="none" stroke="black" stroke-width="${lineWidthMM}" />
</svg>
`));
  a.dispatchEvent(e);
}

generate();
