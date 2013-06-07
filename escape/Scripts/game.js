var width;
var height;

var canvas;
var ctx;

var gameObjects;
var guards;
var prisoners;

var ball;
var maxSpeed;

var delta;
var old;

var score;

function Ball(){
	this.radius = width*height*0.00001;
	this.center = new Vector(width*0.5, this.radius);
	this.image = new Image();
	this.image.src = 'Images/ball.png';
	this.speedX = 0;
	this.speedY = 0;
	this.vertical = 0;
	this.horizontal = 0;
	this.accelerationX = width*0.5;
	this.accelerationY = height*0.5;
	this.p = 0;
	this.draw = function(){
		ctx.drawImage(this.image, this.center.x-this.radius, this.center.y-this.radius, this.radius*2, this.radius*2)
	}
	this.control = function(){
		if(this.p === 1){
			if(Key.isDown(Key.W) || Key.isDown(Key.S)){
				if(this.speedY < maxSpeed){
					this.speedY += delta*this.accelerationY;
					if(this.speedY > maxSpeed){
						this.speedY = maxSpeed;
					}
				}

				if(Key.isDown(Key.W)){
					reduceSpeedY(this, -1);
				}
				else{
					reduceSpeedY(this, 1);
				}
			}
			else{
				this.speedY -= delta*this.accelerationY*2;
				if(this.speedY < 0){
					this.speedY = 0;
					this.vertical = 0;
				}
			}

			if(Key.isDown(Key.A)|| Key.isDown(Key.D)){
				if(this.speedX < maxSpeed){
					this.speedX += delta*this.accelerationX;
					if(this.speedX > maxSpeed){
						this.speedX = maxSpeed;
					}
				}
				if(Key.isDown(Key.A)){
					reduceSpeedX(this, -1);
				}
				else{
					reduceSpeedX(this, 1);
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
		else if(this.p === 2){
			if(Key.isDown(Key.UP) || Key.isDown(Key.DOWN)){
				if(this.speedY < maxSpeed){
					this.speedY += delta*this.accelerationY;
					if(this.speedY > maxSpeed){
						this.speedY = maxSpeed;
					}
				}

				if(Key.isDown(Key.UP)){
					reduceSpeedY(this, -1);
				}
				else{
					reduceSpeedY(this, 1);
				}
			}
			else{
				this.speedY -= delta*this.accelerationY*2;
				if(this.speedY < 0){
					this.speedY = 0;
					this.vertical = 0;
				}
			}

			if(Key.isDown(Key.LEFT) || Key.isDown(Key.RIGHT)){
				if(this.speedX < maxSpeed){
					this.speedX += delta*this.accelerationX;
					if(this.speedX > maxSpeed){
						this.speedX = maxSpeed;
					}
				}
				if(Key.isDown(Key.LEFT)){
					reduceSpeedX(this, -1);
				}
				else{
					reduceSpeedX(this, 1);
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
	}
	this.move = function(){
		this.center.x += this.horizontal*delta*this.speedX;
		this.center.y += this.vertical*delta*this.speedY;
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
	this.collide = function(){
		for(var i = 0; i<guards.length; i++){
			var g = guards[i];
			if (this.center.y +this.radius >= g.center.y - g.halfHeight && this.center.y - this.radius <= g.center.y + g.halfHeight){
				if (this.center.x +this.radius >= g.center.x - g.halfWidth && this.center.x - this.radius <= g.center.x + g.halfWidth){
					this.center.x = width *0.5;
					this.center.y = this.radius;
				}
			}
		}
	}
	this.update = function(){
		this.control();
		this.move();
		this.collide();
		this.boundWall();
	}
}

function Guard(){
	this.center = new Vector(width*0.5, height*0.5);
	this.speed = width * 0.25;
	this.halfWidth = width*0.125;
	this.halfHeight = height * 0.005;
	this.prisoner = prisoners[0];
	this.move = function(){
		if(Math.abs(this.prisoner.center.x - this.center.x) > this.prisoner.radius){
			if(this.prisoner.center.x < this.center.x){
				this.center.x -= delta*this.speed;
			}
			else if(this.prisoner.center.x > this.center.x){
				this.center.x += delta*this.speed;
			}
		}
	}
	this.bound = function(){
		if(this.center.x - this.halfWidth < 0){
			this.center.x = this.halfWidth;
		}
		else if(this.center.x + this.halfWidth > width){
			this.center.x = width - this.halfWidth;
		}
	}
	this.update = function(){
		if(prisoners.length > 1){
			selectPrisoner(this);
		}
		this.move();
		this.bound();
	}
	this.draw = function(){
		ctx.fillRect(this.center.x - this.halfWidth, this.center.y - this.halfHeight, this.halfWidth*2, this.halfHeight*2);
	}
}

function Guard2(){
	this.center = new Vector(width*0.5, height*0.5);
	this.speed = height * 0.25;
	this.halfWidth = height * 0.005;
	this.halfHeight = width*0.125;
	this.prisoner = prisoners[0];
	this.move = function(){
		if(Math.abs(this.prisoner.center.y - this.center.y) > this.prisoner.radius){
			if(this.prisoner.center.y < this.center.y){
				this.center.y -= delta*this.speed;
			}
			else if(this.prisoner.center.y > this.center.y){
				this.center.y += delta*this.speed;
			}
		}
	}
	this.bound = function(){
		if(this.center.y - this.halfHeight < height*0.1){
			this.center.y = height*0.1 + this.halfHeight;
		}
		else if(this.center.y + this.halfHeight > height*0.9){
			this.center.y = height*0.9 - this.halfHeight;
		}
	}
	this.update = function(){
		if(prisoners.length > 1){
			selectPrisoner(this);
		}
		this.move();
		this.bound();
	}
	this.draw = function(){
		ctx.fillRect(this.center.x - this.halfWidth, this.center.y - this.halfHeight, this.halfWidth*2, this.halfHeight*2);
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
	score = 0;
	initCanvas();
	gameObjects = [];
	guards = [];
	prisoners = [];

	prisoners[0] = new Ball();
	prisoners[0].p = 1;

	gameObjects.push(prisoners[0]);
	prisoners[1] = new Ball();
	prisoners[1].p = 2;
	gameObjects.push(prisoners[1]);

	for(var i = 0; i< 5; i++){
		guards[i] = new Guard();
		guards[i].center.y = height*(0.1+0.2*i);
		gameObjects.push(guards[i]);
	}
	guards[5] = new Guard2();
	gameObjects.push(guards[5]);

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

	for(var i = 0; i< gameObjects.length; i++){
		gameObjects[i].update();
	}

}

function draw(){
	for(var i = 0; i< gameObjects.length; i++){
		gameObjects[i].draw();
	}
}

function gameLoop(){
	prepare();
	update();
	draw();
	requestAnimFrame(gameLoop);
}

function reduceSpeedX(object, direction){
	if(object.horizontal != direction){
		object.speedX -= delta*object.accelerationX*4;
		if(object.speedX < 0){
			object.horizontal = direction;
		}
	}
}

function reduceSpeedY(object, direction){
	if(object.vertical != direction){
		object.speedY -= delta*object.accelerationY*4;
		if(object.speedY < 0){
			object.vertical = direction;
		}
	}
}

function selectPrisoner(object){
	for(var i = 0; i<prisoners.length; i++){
		if(object.center.distance(object.prisoner.center) > object.center.distance(prisoners[i].center)){
			object.prisoner = prisoners[i];
		}
	}
}