// License: CC BY-NC 4.0
// Created by: www.josvromans.com
SCALE = 6;
OUTER_FRAME = [];  // just the square around the artwork, can be colored in a seperate color
LAYER1 = [];
LAYER2 = [];
LAYER3 = [];
LAYER4 = [];
LAYER5 = [];
LAYERS = [];


PAPER_DIMENSIONS_MM = 158


function handleMenu() {
    //mobile sidebar handler
    
    const menuToggle = document.getElementById("sidebar-toggle")
    const menu = document.getElementById('sidebar')
    console.log(menu)
    menuToggle.addEventListener('click', ()=>{
        var style = getComputedStyle(menu)
        var visibile = style.getPropertyValue('display')
        
        if(visibile == 'none') {
            menu.style.display = 'flex'
        } else {
            menu.style.display = 'none'
        }
    })
    
}



getRandomInt=_=>Math.random()*256|0;

vtoh=_=>{
    let rv = getRandomInt(0,255).toString(16);
    if (rv.length===1){
        rv = '0' + rv;
    }
    return rv;
}


function get_frame_lines(tl, tr, br, bl, extra){
    return [
        [[tl[0]-extra, tl[1]-extra], [tr[0]+extra, tr[1]-extra]],
        [[bl[0]-extra, bl[1]+extra], [br[0]+extra, br[1]+extra]],
        [[tl[0]-extra, tl[1]-extra], [bl[0]-extra, bl[1]+extra]],
        [[tr[0]+extra, tr[1]-extra], [br[0]+extra, br[1]+extra]],
    ]
}
round2=v=>v.toFixed(2);
convert_co=(co)=>[round2(co[0]), round2(co[1])]

function clear_canvas(ctx, canvas){
    canvas.width  = PAPER_DIMENSIONS_MM*SCALE;
    canvas.height = PAPER_DIMENSIONS_MM*SCALE;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function get_midpoint(a,b){
    return [
      (a[0] + b[0]) / 2,
      (a[1] + b[1]) / 2,
    ];
}


function parse_strategy(strategy_string){
    var strategy = [];
    for (var index=0; index<strategy_string.length; index+=1 ){
        var value = parseInt(strategy_string[index]);
        if (value > 2 || value < 0) {
            alert('The strategy can only contain [0, 1, 2]');
            return [];
        }
        strategy.push(value);
    }
    return strategy;
}



function triangle_subdivision(ctx, canvas){
    var iterations = document.getElementById('iterations').value;
    var strategy = parse_strategy(document.getElementById('strategy').value);
    PAPER_DIMENSIONS_MM = document.getElementById('dimensionsMM').value;

    //manage inputs
    var rangeInputs = document.getElementsByClassName('panel-range')
    var numInputs = document.getElementsByClassName('panel-input')

    for(let i = 0; i < rangeInputs.length; i++) {
        rangeInputs[i].addEventListener('input', ()=> {
            numInputs[i].value = rangeInputs[i].value
        })
        numInputs[i].addEventListener('input', ()=> {
            rangeInputs[i].value = numInputs[i].value
        })
    }

    clear_canvas(ctx, canvas);
    var colorInput0 = document.getElementById('color0');
    var colorInput1 = document.getElementById('color1');
    var colorInput2 = document.getElementById('color2');
    var colorInput3 = document.getElementById('color3');
    var colorInput4 = document.getElementById('color4');
    var colorInput5 = document.getElementById('color5');
    var color0 = colorInput0.value;
    var color1 = colorInput1.value;
    var color2 = colorInput2.value;
    var color3 = colorInput3.value;
    var color4 = colorInput4.value;
    var color5 = colorInput5.value;
    var line_width = document.getElementById('line_width').value;
    COLOR_INPUTS = [
        colorInput0,
        colorInput1,
        colorInput2,
        colorInput3,
        colorInput4,
        colorInput5,
    ]
    COLORS = [
        color0,
        color1,
        color2,
        color3,
        color4,
        color5,
    ]
    //initialize color input label color
    COLOR_INPUTS.map((a)=>{
        console.log(a.parentElement)
        var colorLabel = a.parentElement
        console.log(colorLabel)
        console.log(a.value)
        colorLabel.style.backgroundColor = a.value
        console.log(colorLabel)
    })
    //change color input label on change
    COLOR_INPUTS.map((a)=>{
        console.log(a.parentElement)
        var colorLabel = a.parentElement
        console.log(colorLabel)
        console.log(a.value)
        a.addEventListener('change', ()=>{
            colorLabel.style.backgroundColor = a.value
            console.log(colorLabel)
        })
    })

//    MARGIN = 16;

    let one4th = PAPER_DIMENSIONS_MM/4;
    let three4th = one4th *3;

    var center = [PAPER_DIMENSIONS_MM/2,PAPER_DIMENSIONS_MM/2];
    var top_left = [one4th,one4th];
    var top_right = [three4th,one4th];
    var bottom_left = [one4th,three4th];
    var bottom_right = [three4th,three4th];

    // the outer frame, double lines in black
    OUTER_FRAME = get_frame_lines(top_left, top_right, bottom_right, bottom_left, 1);
    if (!document.getElementById('cb0').checked){
        OUTER_FRAME=[];
    }

    LAYER1 = [];
    LAYER2 = [];
    LAYER3 = [];
    LAYER4 = [];
    LAYER5 = [];
    function subdivide(ctx, vertices, i){
        var strategy_length = strategy.length;
        if (i < iterations) {
            var subdivide_index = strategy[i % strategy_length];
            var subdivide_vertex = vertices.splice(subdivide_index, 1)[0];
            var midpoint = get_midpoint(vertices[0], vertices[1]);
            subdivide(ctx, [subdivide_vertex, midpoint, vertices[0]], i + 1);
            subdivide(ctx, [subdivide_vertex, midpoint, vertices[1]], i + 1);

            // Only the subdivision line will be added to 'lines to be plotted'. So not the entire triangle.
            // uncomment the following statement to only get the final subdivision iteration (less lines to draw)

            if (i===iterations-6 && document.getElementById('cb1').checked){  //
               LAYER1.push([convert_co(midpoint),convert_co(subdivide_vertex)])
            } else if (i===iterations-5 && document.getElementById('cb2').checked){  //
               LAYER2.push([convert_co(midpoint),convert_co(subdivide_vertex)])
            } else if (i===iterations-4 && document.getElementById('cb3').checked){  //
               LAYER3.push([convert_co(midpoint),convert_co(subdivide_vertex)])
            } else if (i===iterations-3 && document.getElementById('cb4').checked){  //
               LAYER4.push([convert_co(midpoint),convert_co(subdivide_vertex)])
            } else if (i===iterations-2 && document.getElementById('cb5').checked){  //
               LAYER5.push([convert_co(midpoint),convert_co(subdivide_vertex)])
            }
        }
    }

    // add the 4 triangles that form a square, and share a vertex in the center of the square
    // calculations will be done for every triangle individually..
    subdivide(ctx, [center, bottom_left, bottom_right], 0);
    subdivide(ctx, [center, top_right, top_left], 0);
    subdivide(ctx, [center, bottom_left, top_left], 0);
    subdivide(ctx, [center, top_right, bottom_right], 0);

    ctx.lineWidth = line_width*SCALE;

    LAYERS = [
        OUTER_FRAME,
        LAYER1,
        LAYER2,
        LAYER3,
        LAYER4,
        LAYER5,
    ]

    for (let i=0; i<6; i++){
        ctx.strokeStyle=COLORS[i];
        LAYERS[i].forEach(pl=>{ctx.beginPath();ctx.moveTo(pl[0][0]*SCALE, pl[0][1]*SCALE);ctx.lineTo(pl[1][0]*SCALE, pl[1][1]*SCALE);ctx.stroke();})
    }
}

function get_random_strategy(){
    let strategy = '0';
    for (let i=0;i<2+Math.random()*15;i++){
        let random_index = Math.random()*3|0;
        strategy += random_index.toString();
    }
    return strategy;
}


constructSVGpath=(layer, color)=>{
  let path_str = '';
  layer.forEach(pl=>path_str += `M ${pl[0][0]} ${pl[0][1]} L ${pl[1][0]} ${pl[1][1]} `)

  LINE_WIDTH=document.getElementById('line_width').value;

  let svg_file = `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${PAPER_DIMENSIONS_MM} ${PAPER_DIMENSIONS_MM}"
  width="${PAPER_DIMENSIONS_MM}mm"
  height="${PAPER_DIMENSIONS_MM}mm"
>
<path d="${path_str}" fill="none" stroke="${color}" stroke-width="${LINE_WIDTH}" />
</svg>
`
  return btoa(unescape(svg_file));

}


function download_svg_file() {

    for (let index=0; index<6; index++){
        let layer = LAYERS[index];
        if (layer.length===0){continue}

        let a = document.createElement('a');
        let e = new MouseEvent('click');
        const base64doc = constructSVGpath(layer, COLORS[index]);

        let index_str = `_${index}`;
        if (index===0){
            index_str = '_0_outer_frame'
        }

        a.download = 'Triangle_subdivision' + document.getElementById('strategy').value + index_str + '.svg';
        a.href = 'data:text/html;base64,' + base64doc;
        a.dispatchEvent(e);
    }
}


document.addEventListener('DOMContentLoaded', function(event) {
    var canvas = document.getElementById('canvas');
    handleMenu()

    canvas.width  = PAPER_DIMENSIONS_MM*SCALE;
    canvas.height = PAPER_DIMENSIONS_MM*SCALE;
    var ctx = canvas.getContext('2d');
    ctx.lineJoin='round'

    document.getElementById('randomColors').addEventListener("mouseup", function() {
        ['color0','color1','color2','color3','color4','color5'].map(c=>{
            document.getElementById(c).value = '#' + vtoh() + vtoh() + vtoh();
        })
        triangle_subdivision(ctx, canvas);
    });

    document.getElementById('start').addEventListener("mouseup", function() {
        triangle_subdivision(ctx, canvas);
    });
//    document.getElementById('clear').addEventListener("mouseup", function() {
//        clear_canvas(ctx, canvas);
//    });
    document.getElementById('download').addEventListener("mouseup", function() {
        var link = document.getElementById('link');
        link.setAttribute('download', 'Triangle_subdivision' + document.getElementById('strategy').value + '.png');
        link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        link.click();
    });
    document.getElementById('random').addEventListener("mouseup", function() {
        document.getElementById('strategy').value = get_random_strategy();
        triangle_subdivision(ctx, canvas);
    });

    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 13) {triangle_subdivision(ctx, canvas);}  // Enter
        else if (event.keyCode === 67) {clear_canvas(ctx, canvas);}  // c
    });

    // if a strategy was provided by the url, render it
    var queryString = window.location.search;
    var splitted = queryString.split('?strategy=');  // prevent using URLSearchParams, no other parameters are allowed

    if (splitted.length === 2) {
        document.getElementById('strategy').value = splitted[1];
    }
    triangle_subdivision(ctx, canvas);
});
