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

function Ball(number){
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
	this.p = number;
	this.scored = [];
	this.active = false;
	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;

	gameObjects.push(this);
	for(var i = 0; i< 10; i++){
		this.scored[i] = false;
	}
	this.draw = function(){
		ctx.drawImage(this.image, this.center.x-this.radius, this.center.y-this.radius, this.radius*2, this.radius*2)
	}
	this.control = function(){
		if(this.up || this.down){
			if (this.speedY < maxSpeed) {
				this.speedY += delta * this.accelerationY;
				if (this.speedY > maxSpeed) {
					this.speedY = maxSpeed;
				}
			}
			if(this.up){
				changeDirY(this, -1);
			}
			else{
				changeDirY(this, 1);
			}
		}
		else{
			this.speedY -= delta*this.accelerationY*2;
			if(this.speedY < 0){
				this.speedY = 0;
				this.vertical = 0;
			}
		}
		if(this.left || this.right){
			if (this.speedX < maxSpeed) {
				this.speedX += delta * this.accelerationX;
				if (this.speedX > maxSpeed) {
					this.speedX = maxSpeed;
				}
			}
			if(this.left){
				changeDirX(this, -1);
			}
			else{
				changeDirX(this, 1);
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
		this.center.x += this.horizontal*delta*this.speedX;
		this.center.y += this.vertical*delta*this.speedY;
	}
	this.score = function(){
		// for(var i = 10; i>0; i--){
		// 	if(this.center.y > height*(0.1 + i*0.2)){
		// 		score += i*2;
		// 		this.scored[i]
		// 		alert(score);
		// 	}
		// }
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
		this.score();
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
	this.active = true;
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
	this.active = true;
	this.select = function(){
		for(var i = 0; i<prisoners.length; i++){
			if(this.center.distance(this.prisoner.center) > this.center.distance(prisoners[i].center)){
				this.prisoner = prisoners[i];
			}
		}
	}
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
			this.select();
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
	N8: 104,
	N5: 101,
	N4: 100,
	N6: 102,
	I: 73,
	K: 75,
	J: 74,
	L: 76,
	isDown: function (keyCode) {
		return this.pressed[keyCode];
	},
	onKeydown: function (e) {
		this.pressed[e.keyCode] = true;
		controlMap();
	},
	onKeyup: function (e) {
		delete this.pressed[e.keyCode];
		controlMap();
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
	for(var i = 0; i< 4; i++){
		prisoners[i] = new Ball(i+1);
	}
	prisoners[0].active = true;

	for(var i = 0; i< 4; i++){
		guards[i] = new Guard();
		guards[i].center.y = height*(0.1+0.25*i);
		gameObjects.push(guards[i]);
	}
	guards[4] = new Guard2();
	gameObjects.push(guards[4]);

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
	if(!prisoners[1].active && Key.isDown(Key.UP)){
		prisoners[1].active = true;
	}
	else if(!prisoners[2].active && Key.isDown(Key.N8)){
		prisoners[2].active = true;
	}
	else if(!prisoners[3].active && Key.isDown(Key.I)){
		prisoners[3].active = true;
	}
}

function update(){
	for(var i = 0; i< gameObjects.length; i++){
		if(gameObjects[i].active){
			gameObjects[i].update();
			gameObjects[i].draw();
		}
	}

}

function gameLoop(){
	prepare();
	update();
	requestAnimFrame(gameLoop);
}

function selectPrisoner(object){
	var distFromClosest = 2000;
	for(var i = 0; i<prisoners.length; i++){
		if(prisoners[i].active && Math.abs(prisoners[i].center.y-object.center.y) < height*0.2){
			var distToCompare = object.center.distance(prisoners[i].center);
			if (distToCompare < distFromClosest) {
				object.prisoner = this.prisoners[i];
				distFromClosest = distToCompare;
			}
		}
	}
}

function changeDirX(object, direction) {
	if (object.horizontal != direction) {
		object.speedX -= delta * object.accelerationX * 3.5;
		if (object.speedX < 0) {
			object.horizontal = direction;
		}
	}
}

function changeDirY(object, direction) {
	if (object.vertical != direction) {
		object.speedY -= delta * object.accelerationY * 3.5;
		if (object.speedY < 0) {
			object.vertical = direction;
		}
	}
}

function controlMap(){
	if(Key.isDown(Key.W))
		prisoners[0].up = true;
	else
		prisoners[0].up = false;
	if(Key.isDown(Key.S))
		prisoners[0].down = true;
	else
		prisoners[0].down = false;
	if(Key.isDown(Key.A))
		prisoners[0].left = true;
	else
		prisoners[0].left = false;
	if(Key.isDown(Key.D))
		prisoners[0].right = true;
	else
		prisoners[0].right = false;

	if(Key.isDown(Key.UP))
		prisoners[1].up = true;
	else
		prisoners[1].up = false;
	if(Key.isDown(Key.DOWN))
		prisoners[1].down = true;
	else
		prisoners[1].down = false;
	if(Key.isDown(Key.LEFT))
		prisoners[1].left = true;
	else
		prisoners[1].left = false;
	if(Key.isDown(Key.RIGHT))
		prisoners[1].right = true;
	else
		prisoners[1].right = false;

	if(Key.isDown(Key.N8))
		prisoners[2].up = true;
	else
		prisoners[2].up = false;
	if(Key.isDown(Key.N5))
		prisoners[2].down = true;
	else
		prisoners[2].down = false;
	if(Key.isDown(Key.N4))
		prisoners[2].left = true;
	else
		prisoners[2].left = false;
	if(Key.isDown(Key.N6))
		prisoners[2].right = true;
	else
		prisoners[2].right = false;

	if(Key.isDown(Key.I))
		prisoners[3].up = true;
	else
		prisoners[3].up = false;
	if(Key.isDown(Key.K))
		prisoners[3].down = true;
	else
		prisoners[3].down = false;
	if(Key.isDown(Key.J))
		prisoners[3].left = true;
	else
		prisoners[3].left = false;
	if(Key.isDown(Key.L))
		prisoners[3].right = true;
	else
		prisoners[3].right = false;
}