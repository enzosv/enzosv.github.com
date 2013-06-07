var width;
var height;

var canvas;
var ctx;

var ball;

function Ball(){
	this.center = new Vector(width*0.5, height*0.5);
	this.radius = width*height*0.00001;
	this.image = new Image();
	this.image.src = 'Images/ball.png';
	this.draw = function(){
		ctx.drawImage(this.image, this.center.x-this.radius, this.center.y-this.radius, this.radius*2, this.radius*2)
	}
}

function init(){
	width = window.innerWidth - 15;
	height = window.innerHeight - 45;
	initCanvas();
	ball = new Ball();
	ball.draw();
}

function initCanvas(){
	canvas = document.createElement('canvas');
	document.body.appendChild(canvas);
	ctx = canvas.getContext('2d');
	setCanvas();
}

function setCanvas(){
	canvas.width = width;
	canvas.height = height;
	canvas.setAttribute("style", "border: 1px solid white;");
	ctx.fillStyle = "rgb(255,255,255)";
}



function gameLoop(){

}
