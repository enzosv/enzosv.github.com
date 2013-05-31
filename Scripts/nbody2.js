//sources: http://codeflow.org/entries/2010/aug/22/html5-canvas-and-the-flying-dots/
var canvas;
var ctx;
var width;
var height;
var damping;
var radius;
var speed;
var limit;
var b;
var delta;
var old;
var fontWidth;
var image;
var diameter;
var lengthLimit;
var vec;
var length;
//canvas
function init() {
    width = window.innerWidth - 30;
    height = window.innerHeight - 45;
    damping = 0.5;
    radius = height / 200;
    diameter = height / 100;
    lengthLimit = radius * 10;
    speed = width * 2 / height;
    b = [];
    delta = 0;
    old = Date.now();
    fontWidth = width / 2 - height / 18;
    image = new Image();
    image.src = 'Images/nbody.png';
    vec = 0;
    length = 0;
    drawCanvas();
}
function drawCanvas() {
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.setAttribute("style", "border: 1px solid white;");
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    ctx.fillStyle = "rgba(255,255,255, 1)";
    ctx.font = 'normal ' + 12 + 'px Lucida Console';
    limit = prompt("How many particles?");
    for (var x = 0; x < limit; x++) {
        //var red = Math.random() * 255;
        //var blue = Math.random() * 255;
        //var green = Math.random() * 255;
        //b[x] = new Ball("rgb(" + red + "," + green + "," + blue + ")");
        b[x] = new Ball();
        //b[x].color = "rgba(255,255,255, 1)";
        //b[x].color = "rgba(" + 0 + "," + green + "," + blue + ",0.9)";
    }
    prepare();
}


//ball
var Vector = function (x, y) {
    this.x = x;
    this.y = y;

    this.sub = function (other) {
        return new Vector(
            this.x - other.x,
            this.y - other.y
            );
    }
    this.isub = function (other) {
        this.x -= other.x;
        this.y -= other.y;
    }
    this.add = function (other) {
        this.x += other.x;
        this.y += other.y;
    }
    this.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    this.div = function (scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }
    this.zero = function () {
        this.x = 0;
        this.y = 0;
    }
    this.validate = function () {
        if (isNaN(this.x + this.y)) {
            this.x = 0;
            this.y = 0;
        }
    }
    this.distance = function (other) {
        return Math.sqrt((other.x - this.x) * (other.x - this.x) + (other.y - this.y) * (other.y - this.y));
    }
}
function Ball() {
    this.pos = new Vector(Math.random() * width, Math.random() * height);
    this.vel = new Vector(Math.random() * (speed + speed + 1) - speed, Math.random() * (speed + speed + 1) - speed);
    this.acl = new Vector(0, 0);
    this.radius = radius;
    this.diameter = this.radius*2;
    this.addForce = function () {
        this.vel.add(this.acl);
        this.acl.zero();
    }
    this.move = function () {
        this.addForce();
        this.pos.add(this.vel);
        if (this.pos.x + this.diameter > width) {
            this.pos.x = width - this.diameter;
            this.vel.x *= -damping;
        }
        else if (this.pos.x < 0) {
            this.pos.x = 0;
            this.vel.x *= -damping;
        }
        if (this.pos.y + this.diameter > height) {
            this.pos.y = height - this.diameter;
            this.vel.y *= -damping;
        }
        else if (this.pos.y < 0) {
            this.pos.y = 0;
            this.vel.y *= -damping;
        }

    }
    this.collide = function(){
        for(var i = 0; i<b.length; i++){
            if(b[i].pos.x !== this.pos.x){
                if(this.pos.distance(b[i].pos) < this.radius+b[i].radius){
                    this.radius += b[i].radius
                    this.diameter = this.radius*2;
                    //this.vel = new Vector(0,0);
                    b.splice(i,1);
                }else if(this.pos.distance(b[i].pos) < lengthLimit){
                    vec = this.pos.sub(b[i].pos);
                    length = vec.length();

                    if (length > lengthLimit) {
                        vec.div(Math.pow(length, 3) / 9);
                        b[i].acl.add(vec);
                        this.acl.isub(vec);
                    }
                }
            }
        }
    }
    this.draw = function () {
        this.move();
        this.collide();
        ctx.drawImage(image, this.pos.x, this.pos.y, this.diameter, this.diameter);
    }
}
//game

function prepare() {
    delta = Date.now() - old;
    old = Date.now();
    ctx.clearRect(0, 0, width, height);

    ctx.fillText(delta, fontWidth, height);

    update();
}

function update() {
    for (var x = 0; x < b.length; x++) {
        b[x].draw();
    }
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