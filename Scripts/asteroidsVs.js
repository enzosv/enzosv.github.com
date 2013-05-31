/**
 * @author Enzo
 */

window.onload = (function() {

	var width = window.innerWidth - 17;
	var height = window.innerHeight - 17;
	var speed = width / 70;
	var speedY = height / 130;
	var length = height / 20;
	var i = 0;
	var bullets = [];
	var k = 0;
	var total, total2;
	var limit = 0;
	if (limit < 1) {
		limit = 99999;
	}
	Crafty.init(width, height);
	//Crafty.canvas.init();
	Crafty.background("black");

	
	
	var score = Crafty.e("2D, DOM, Text").textFont({
		family : "Lucida Console",
		size : length / 2.5 + "px",
		weight : "bold"
	}).text("Hit: " + 0 + "\nMiss: " + 0 + "\nDeaths: " + 0 + "\nScore:  0").textColor("#FFFFFF").attr({
		w : length * 2.7,
		h : 100,
		x : length / 3,
		y : height - (length / 3) - 75
	});

	var score2 = Crafty.e("2D, DOM, Text").textFont({
		family : "Lucida Console",
		size : length / 2.5 + "px",
		weight : "bold"
	}).text("Hit: " + 0 + "\nMiss: " + 0 + "\nDeaths: " + 0 + "\nScore:  0").textColor("#FFFFFF").attr({
		w : length * 2.7,
		h : 100,
		x : width - length * 3,
		y : length / 3
	});
	
	function endMessage(x) {
		Crafty.e("2D, DOM, Text").textFont({
			family : "Lucida Console",
			size : length + "px",
			weight : "bold"
		}).text(total2  + " Player " + x + " Wins! " + total).textColor("#FFFFFF").attr({
			w : length*15,
			h : length,
			x : width / 2 - length*6.2,
			y : height / 2 - length
		});
		player1.removeComponent("Ship");
		player2.removeComponent("Ship");
		score2.destroy();
		score.destroy();
	};
	//players
	var player1 = Crafty.e("2D, DOM, Color, Collision, Keyboard, Ship").color("white").attr({
		w : length,
		h : length,
		x : width / 2 - length / 3,
		y : height - (length * 2) + 10,
		hits : 0,
		miss : 0,
		death : 0,
		color : "white",
		id : 1,
		enemyCount : 1
	}).bind('EnterFrame', function() {
		if (this.x > width) {
			this.x = 0;
		} else if (this.x < 0) {
			this.x = width;
		}
	}).bind('KeyDown', function(key) {
		if (key.keyCode === Crafty.keys.W) {
			new bullet(this);
		}
	});
	player1.addComponent("Multiway").multiway(speed, {
		A : 180,
		D : 0
	});
	var player2 = Crafty.e("2D, DOM, Color, Collision, Keyboard, Ship").color("grey").attr({
		w : length,
		h : length,
		x : width / 2 - length / 3,
		y : length,
		hits : 0,
		miss : 0,
		death : 0,
		color : "grey",
		id : 2,
		enemyCount : 1
	}).bind('EnterFrame', function() {
		if (this.x > width) {
			this.x = 0;
		} else if (this.x < 0) {
			this.x = width;
		}
	}).bind('KeyDown', function(key) {
		if (key.keyCode === Crafty.keys.UP_ARROW) {
			new bullet(this);
		}
	});
	player2.addComponent("Multiway").multiway(speed, {
		RIGHT_ARROW : 0,
		LEFT_ARROW : 180
	});

	new enemy(player1);
	new enemy(player2);

	function bullet(player) {
		var offset = 10;
		var bulletSpeed = speedY;

		if (player.y === player2.y) {
			offset = 5;
			bulletSpeed *= -1;
		}
		Crafty.e("2D, DOM, Color, Collision, Bullet").color(player.color).attr({
			w : 10,
			h : 10,
			x : player.x + player.w / 3,
			y : player.y + offset,
			dY : bulletSpeed

		}).collision().bind('EnterFrame', function() {
			this.y -= this.dY;
			if (this._y < 0 || this._y > height) {
				player.miss++;
				updateScore();
				this.destroy();
			}
		}).onHit("Enemy", function(hit) {
			if (hit[0].obj.id != player.id) {
				if (player.hits % 5 === 0 && player.enemyCount < width / 180) {
					new enemy(player);
					player.enemyCount++;
				}
				this.destroy();
				updateScore();
				resetAsteroid(hit[0].obj);
				player.hits++;
			}
		});
	};

	function enemy(player) {
		var enemySpeed = -(speedY * 2 / 3);
		var yPos = player1.y - (player1.h + length);
		var i = 1;
		if (player.y === player2.y) {
			enemySpeed *= -1
			yPos = player2.y + player2.h;
			i = 2;
		}
		Crafty.e("2D, DOM, Color, Collision, Enemy").color(player.color).attr({
			w : length * 59 / 30,
			h : length * 59 / 30,
			dY : enemySpeed,
			x : Crafty.math.randomNumber(0, width - length * 59 / 30),
			y : yPos,
			origin : yPos,
			id : i
		}).collision().bind('EnterFrame', function() {
			this.y += this.dY;
			if (this.y > height || this.y < 0) {
				updateScore();
				resetAsteroid(this);
			}
		}).onHit("Ship", function(hit) {
			destroyShip(this, hit[0].obj);
		});
	};
	resetAsteroid = function(obj) {
		/*obj.dY += (player1.hits + player2.hits) / 10;
		 obj.dY -= (player1.miss + player2.miss) / 10 + (player1.death + player2.death);
		 if (obj.dY > speedY * 3 / 2) {
		 obj.dY = speedY * 3 / 2;
		 } else if (obj.dY < speedY * 2 / 3) {
		 obj.dY = speedY * 2 / 3;
		 }*/
		obj.y = obj.origin;
		obj.x = Crafty.math.randomNumber(0, width * 14 / 15);
	};

	updateScore = function() {
		total = Math.floor((10 * player1.hits) - (100 * player1.death) - (player1.miss / 4) + (100 * player2.death));
		score.text("Hit: " + player1.hits + "\nMiss: " + Math.floor(player1.miss) + "\nDeaths: " + player1.death + "\nScore: " + total);
		total2 = Math.floor((10 * player2.hits) - (100 * player2.death) - (player2.miss / 4) + (100 * player1.death));
		score2.text("Hit: " + player2.hits + "\nMiss: " + Math.floor(player2.miss) + "\nDeaths: " + player2.death + "\nScore: " + total2);
		if (total >= limit) {
			new endMessage(1);
		} else if (total2 >= limit) {
			new endMessage(2);
		}
	};

	destroyShip = function(obj, player) {
		player.removeComponent("Ship");
		player.x = width / 2 - length / 3;
		player.death++;
		//obj.dY = speedY * 2 / 3;
		player.timeout(function() {
			player.addComponent("Ship");
		}, 3000);
		updateScore();
		resetAsteroid(obj);
	}; crafty

});
