/**
 * @author Enzo
 */

window.onload = (function() {
	var width = window.innerWidth - 17;
	var height = window.innerHeight - 17;
	var speed = width / 70;
	var speedY = height / 130;
	var length = height / 20;
	var hits = 0;
	var miss = 0;
	var death = 0;
	var total = 0;
	var i = 0;
	var enemyCount = 1;
	var bullets = [];
	var k = 0;

	Crafty.init(width, height);
	//Crafty.canvas.init();
	Crafty.background("black");
	for (var x = 0; x < enemyCount; x++) {
		new enemy();
	}
	//players
	var player1 = Crafty.e("2D, DOM, Color, Collision, Ship, Keyboard").color("white").attr({
		w : length,
		h : length,
		x : width / 2 - length / 3,
		y : height - length * 2
	}).bind('EnterFrame', function() {
		if (this.x > width) {
			this.x = 0;
		} else if (this.x < 0) {
			this.x = width;
		}
	}).bind('KeyDown', function(key) {
		if (key.keyCode === Crafty.keys.SPACE) {
			new bullet();
		}
	});
	player1.addComponent("Multiway").multiway(speed, {
		A : 180,
		D : 0,
		RIGHT_ARROW : 0,
		LEFT_ARROW : 180
	});

	function bullet() {
		Crafty.e("2D, DOM, Color, Collision, Bullet").color("white").attr({
			w : 10,
			h : 10,
			x : player1.x + player1.w / 3,
			y : player1.y + 10,
			dY : speedY
		}).collision().bind('EnterFrame', function() {
			this.y -= this.dY;
			if (this._y < 0) {
				miss++;
				updateScore();
				this.destroy();
			}
		}).onHit("Enemy", function(hit) {
			hits++;
			if (hits % 7 === 0 && enemyCount < width / 140) {
				new enemy();
				enemyCount++;
			}
			this.destroy();
			updateScore();
			resetAsteroid(hit[0].obj);
		});
	};

	function enemy() {
		Crafty.e("2D, DOM, Color, Collision, Enemy").color("white").attr({
			w : length * 59 / 30,
			h : length * 59 / 30,
			dY : speedY * 2 / 3,
			x : Crafty.math.randomNumber(0, width - length * 59 / 30),
			y : 0
		}).collision().bind('EnterFrame', function() {
			this.y += this.dY;
			if (this.y > height) {
				miss += 1 / enemyCount;
				updateScore();
				resetAsteroid(this);
			}
		}).onHit("Ship", function(hit) {
			destroyShip(this);
		});
	};
	resetAsteroid = function(obj) {
		obj.dY += hits / 10;
		obj.dY -= miss / 10 + death;
		if (obj.dY > speedY * 3 / 2) {
			obj.dY = speedY * 3 / 2;
		} else if (obj.dY < speedY * 2 / 3) {
			obj.dY = speedY * 2 / 3;
		}
		obj.y = 0;
		obj.x = Crafty.math.randomNumber(0, width * 14 / 15);
	};
	var score = Crafty.e("2D, DOM, Text").textFont({
		family : "Lucida Console",
		size : length / 2.5 + "px",
		weight : "bold"
	}).text("Hit: " + hits + "\nMiss:    " + miss + "\nDeaths: " + death + "\nScore: " + total).textColor("#FFFFFF").attr({
		w : length * 2.7,
		h : 100,
		x : length / 3,
		y : length / 3
	});

	updateScore = function() {
		total = Math.floor((10 * hits) - (100 * death) - (miss / 4) + enemyCount);
		score.text("Hit: " + hits + "\nMiss: " + Math.floor(miss) + "\nDeaths: " + death + "\nScore: " + total);
	};
	destroyShip = function(obj) {
		player1.removeComponent("Ship");
		player1.x = width / 2 - length / 3;
		death++;
		if(death===3){
			alert("You Lose!");
		}
		obj.dY = speedY * 2 / 3;
		player1.timeout(function(){
			player1.addComponent("Ship");
		}, 3000);
		updateScore();
		resetAsteroid(obj);
	};

});
