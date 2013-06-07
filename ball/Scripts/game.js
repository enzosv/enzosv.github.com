var width;
var height;

var canvas;
var ctx;

var ball;
var maxSpeed;

var delta;
var old;

function Ball(){
	this.center = new Vector(width*0.5, height*0.5);
	this.radius = width*height*0.00001;
	this.image = new Image();
	this.image.src = 'Images/ball.png';
	this.speedX = 0;
	this.speedY = 0;
	this.vertical = 0;
	this.horizontal = 0;
	this.accelerationX = width*0.5;
	this.accelerationY = height*0.5;
	this.draw = function(){
		ctx.drawImage(this.image, this.center.x-this.radius, this.center.y-this.radius, this.radius*2, this.radius*2)
	}
	this.control = function(){
		if(Key.isDown(Key.W) || Key.isDown(Key.UP) || Key.isDown(Key.S) || Key.isDown(Key.DOWN)){
			if(this.speedY < maxSpeed){
				this.speedY += delta*this.accelerationY;
				if(this.speedY > maxSpeed){
					this.speedY = maxSpeed;
				}
			}

			if(Key.isDown(Key.W) || Key.isDown(Key.UP)){
				if(this.vertical != -1){
					this.speedY -= delta*this.accelerationY*4;
					if(this.speedY < 0){
						this.vertical = -1;
					}
				}
			}
			else{
				if(this.vertical != 1){
					this.speedY -= delta*this.accelerationY*4;
					if(this.speedY < 0){
						this.vertical = 1;
					}
				}
			}
		}
		else{
			this.speedY -= delta*this.accelerationY*2;
			if(this.speedY < 0){
				this.speedY = 0;
				this.vertical = 0;
			}
		}

		if(Key.isDown(Key.A) || Key.isDown(Key.LEFT) || Key.isDown(Key.D) || Key.isDown(Key.RIGHT)){
			if(this.speedX < maxSpeed){
				this.speedX += delta*this.accelerationX;
				if(this.speedX > maxSpeed){
					this.speedX = maxSpeed;
				}
			}
			if(Key.isDown(Key.A) || Key.isDown(Key.LEFT)){
				if(this.horizontal != -1){
					this.speedX -= delta*this.accelerationX*4;
					if(this.speedX < 0){
						this.horizontal = -1;
					}
				}
			}
			else{
				if(this.horizontal != 1){
					this.speedX -= delta*this.accelerationX*4;
					if(this.speedX < 0){
						this.horizontal = 1;
					}
				}
			}
		}
		else{
			this.speedX -= delta*this.accelerationX*2;
			if(this.speedX < 0){
				this.speedX = 0;
				this.horizontal = 0;
			}
		}
	}
	this.move = function(){
		this.control();
		this.center.x += this.horizontal*delta*this.speedX;
		this.center.y += this.vertical*delta*this.speedY;
		this.boundWall();
	}
	this.boundWall = function(){
		if(this.center.x - this.radius < 0){
			this.center.x = this.radius;
		}
		else if(this.center.x + this.radius > width){
			this.center.x = width - this.radius;
		}
		if(this.center.y - this.radius < 0){
			this.center.y = this.radius;
		}
		else if(this.center.y + this.radius > height){
			this.center.y = height - this.radius;
		}
	}
}

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

function init(){
	old = Date.now();
	delta = 0;
	width = window.innerWidth - 15;
	height = window.innerHeight - 45;
	maxSpeed = width*height*0.0005;
	initCanvas();
	ball = new Ball();

	window.addEventListener('keyup', function (event) {
		Key.onKeyup(event);
	}, false);
	window.addEventListener('keydown', function (event) {
		Key.onKeydown(event);
	}, false);

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

function prepare(){
	delta = (Date.now() - old)/1000;
	old = Date.now();
	ctx.clearRect(0,0,width, height);
}

function update(){
	ball.move();
}

function draw(){
	ball.draw();
}

function gameLoop(){
	prepare();
	update();
	draw();
	requestAnimFrame(gameLoop);
}
