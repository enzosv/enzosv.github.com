//sources: http://codeflow.org/entries/2010/aug/22/html5-canvas-and-the-flying-dots/
var canvas;
var ctx;
var width;
var height;

var startTime;
var nowTime;
var exercises;
var counter; 
var breakTime;
var timeLimit;

var clearX;
var clearY;
var clearW;
var clearH;
//canvas

function main(){
    init();
    sevenMin();
}

function init() {
    width = window.innerWidth - 30;
    height = window.innerHeight - 45;
      
    exercises = []; 
    for (var i = 0; i < 8; i++) {
         exercises[i] = new Image();
         exercises[i].src = 'Images/7min/' + (i+1) + '.png';
    }
    // exercises[12] = new Image();
    // exercises[12].src = 'Images/7min/' + (12) + '.png';
    counter = 0; 
    breakTime = true; 
    clearX = width*1/5-128;
    clearY = height/2-128;
    clearW = width*1/5+152;
    clearH = 272;
    drawCanvas();

    exercises[0].addEventListener("load", function () {
        changeImage();
    }, false);
}

function drawCanvas() {
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.setAttribute("style", "border: 1px solid white;");
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    ctx.fillStyle = "rgba(255,255,255, 1)";
    ctx.font = 'normal ' + 256 + 'px Lucida Console';
}

function sevenMin() {
    nowTime = (Date.now() - startTime)/1000;
    ctx.clearRect(clearX, clearY, clearW, clearH);
    ctx.fillText(nowTime.toFixed(0), clearX, height/2+128);
    if(nowTime>=timeLimit){
        changeImage();
    }
    requestAnimFrame(sevenMin);
}

requestAnimFrame = (function () {

    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 16.66667);
    };
})();


function changeImage(){
    ctx.clearRect(0, 0, width, height);
    breakTime = !breakTime;
    if(!breakTime){
        timeLimit = 20;
    }
    else{
        timeLimit = 10;
        counter++;
        
        ctx.fillText("Rest", clearX-128, height/5+32);
    }
    drawBar();
    ctx.drawImage(exercises[counter], width*5/8, height/2-width/6, width/3, width/3);
    startTime = Date.now(); 
}

function drawBar(){
    for (var i = 0; i < counter; i++) {
         ctx.drawImage(exercises[i], width/16+80*(i-1), height-128, 64, 64);
     } 
}