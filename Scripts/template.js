//sources: http://msdn.microsoft.com/en-us/library/gg589521%28v=vs.85%29.aspx
//http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
var canvas;
var ctx;
var width;
var height;
var oldFrame;
var delta;

function init(){
    loadContent();
    width = window.innerWidth - 15;
    height = window.innerHeight - 45;
    oldFrame = getTime();
    drawCanvas();
}
function loadContent(){

}

function drawCanvas() {
    canvas = document.createElement('canvas');
    canvas.setAttribute("id", "canvas");
    canvas.setAttribute("style", "border: 1px solid white;");
    canvas.addEventListener('touchstart', touch, false);
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    window.addEventListener('keyup', function (event) {
        Key.onKeyup(event);
    }, false);
    window.addEventListener('keydown', function (event) {
        Key.onKeydown(event);
    }, false);
    ctx.font = 'normal ' + 12 + 'px Lucida Console';
    prepare();
}

    //taken from http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
var Key = {
    pressed: {},
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    W: 87,
    S: 83,
    A: 65,
    D: 68,
    ESC: 27,
    isDown: function (keyCode) {
        return this.pressed[keyCode];
    },
    onKeydown: function (e) {
        this.pressed[e.keyCode] = true;
    },
    onKeyup: function (e) {
        delete this.pressed[e.keyCode];
    }
}

function touch(ev){
    this.x = ev.changedTouches[0].pageX - canvas.offsetLeft;
    this.y = ev.changedTouches[0].pageY - canvas.offsetTop;

    canvas.addEventListener('touchend', touchup, false);
}
function touchup(ev){
    this.x = ev.changedTouches[0].pageX - canvas.offsetLeft;
    this.y = ev.changedTouches[0].pageY - canvas.offsetTop;

}

function keyInput() {

}

function touchInput(){

}

function getTime(){
    return window.performance.now ?
    (performance.now() + performance.timing.navigationStart) : 
    Date.now();
}

function Vector(x, y){
    var x = x; 
    var y = y;
    this.plusEquals = function (other) {
        x += other.x;
        y += other.y;
    }
    this.minusEquals = function(other) {
        x -= other.x;
        y -= other.y;
    }
    this.timesEquals = function(value) {
        x *= value;
        y *= value;
    }
    this.divideEquals = function(value) {
        x /= value;
        y /= value;
    }
    this.plus = function(other){
        return new vector(x+other.x, y+other.y);
    }
    this.minus = function(other){
        return new vector(x-other.x, y-other.y);
    }
    this.times = function(value){
        return new vector(x*value, y*value);
    }
    this.divide = function(value){
        return new vector(x/value, y/value);
    }
    this.distance = function(other){
        return Math.sqrt((other.x-x)*(other.x-x)+(other.y-y)*(other.y-y));
    }
    this.zero = function(){
        return new Vector(0,0);
    }
    this.length = function(){
        return Math.sqrt(x * x + y * y);
    }
    this.normalize = function(){
    }
}

function prepare() {
    delta = getTime()-oldFrame;

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgb(255,255,255)";
    update();
}

function update() {
    keyInput();
    touchInput();
    draw();
}

function draw(){
    drawText();
}


function drawText(){
    ctx.fillText('fps: ' + delta, width/2, height/2);
    oldFrame = getTime();
    requestAnimFrame(prepare);
}

requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();


