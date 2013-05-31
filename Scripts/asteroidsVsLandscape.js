//sources: http://msdn.microsoft.com/en-us/library/gg589521%28v=vs.85%29.aspx
//http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
var canvas;
var ctx;
var width;
var height;
var aistupidity;
var p1;
var p2;
var projectileRadius;
var playerRadius;
var humanImage;
var alienImage;
var humanEnemyImage;
var alienEnemyImage;
var hProj1;
var hProj2;
var hProj3;
var aProj1;
var aProj2;
var aProj3;
var maxEnemies;
var textYPos;
var text1XPos;
var text2XPos;
var whiteFill;
var font;

function init(){
    loadContent();
    width = window.innerWidth - 15;
    height = window.innerHeight - 45;
    aistupidity = 150;//higher is easier
    delta = 0;
    projectileRadius = height*width/300000;
    playerRadius = projectileRadius*10;
    enemyRadius = projectileRadius*12;
    maxEnemies = 5;
    p1 = new Player(1);
    p2 = new Player(-1);
    p2.center.x = width - 1.5*playerRadius;
    textYPos = height/32;
    text1XPos = p1.center.x-playerRadius*1.4;
    text2XPos = p2.center.x-playerRadius*1.6;
    whiteFill = 'rgb(255,255,255)';
    font = 'normal ' + 12 + 'px Lucida Console';
    drawCanvas();
    drawInstructions();
}
function loadContent(){
    //assetmanager
    //http://www.html5rocks.com/en/tutorials/games/assetmanager/
    humanImage = new Image();
    humanImage.src = 'Images/Asteroids/humanTop.png';
    alienImage = new Image();
    alienImage.src = 'Images/Asteroids/alienTop.png';
    humanEnemyImage = new Image();
    humanEnemyImage.src = 'Images/Asteroids/humanEnemy.png';
    alienEnemyImage = new Image();
    alienEnemyImage.src = 'Images/Asteroids/alienEnemy.png';
    hProj1 = new Image();
    hProj1.src = 'Images/Asteroids/humanProjectile1.png';
    hProj2 = new Image();
    hProj2.src = 'Images/Asteroids/humanProjectile2.png';
    hProj3 = new Image();
    hProj3.src = 'Images/Asteroids/humanProjectile3.png';
    aProj1 = new Image();
    aProj1.src = 'Images/Asteroids/alienProjectile1.png';
    aProj2 = new Image();
    aProj2.src = 'Images/Asteroids/alienProjectile2.png';
    aProj3 = new Image();
    aProj3.src = 'Images/Asteroids/alienProjectile3.png';
}
    //canvas
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
        
        if(this.x < width/2){
            if(this.x < width/4){
                this.y = ev.changedTouches[0].pageY - canvas.offsetTop;
                if(this.y < height/2){
                    p1.up = true;
                    p1.down = false;
                    p1.aible = false;
                }else if(this.y > height/2){
                    p1.up = false;
                    p1.down = true;
                    p1.aible = false;
                }
            } else{
                p1.firing = true;
            }
        }else{
            if(this.x > width*3/4){
                this.y = ev.changedTouches[0].pageY - canvas.offsetTop;
                if(this.y < height/2){
                    p2.up = true;
                    p2.down = false;
                    p2.aible = false;
                }else if(this.y > height/2){
                    p2.up = false;
                    p2.down = true;
                    p2.aible = false;
                }
            }
            else{
                p2.firing = true;
            }
        }
        canvas.addEventListener('touchend', touchup, false);
    }
    function touchup(ev){
        this.x = ev.changedTouches[0].pageX - canvas.offsetLeft;
        if(this.x < width/2){
            p1.up = false;
            p1.down = false;
            p1.firing = false;
        }
        if(this.x > width/2){
            p2.up = false;
            p2.down = false;
            p2.firing = false;
        }
    }

    function control() {
        if (Key.isDown(Key.W)) {
            p1.move("up");
            p1.aible = false;
        } else if (Key.isDown(Key.S)) {
            p1.move("down");
            p1.aible = false;
        }
        if (Key.isDown(Key.D)) {
            p1.firing = true;
            p1.aible = false;
            delete Key.pressed[Key.D];
        }

        if (Key.isDown(Key.UP)) {
            p2.move("up");
            p2.aible = false;
        } else if (Key.isDown(Key.DOWN)) {
            p2.move("down");
            p2.aible = false;
        }
        if (Key.isDown(Key.LEFT)) {
            p2.firing = true;
            p2.aible = false;
            delete Key.pressed[Key.LEFT];
        }
    }

    function touchControl(){
        if(p1.up){
            p1.move("up")
        }
        else if(p1.down){
            p1.move("down")
        }
        if(p2.up){
            p2.move("up")
        }
        else if(p2.down){
            p2.move("down")
        }
    }

    function vector(x, y){
        this.x = x; this.y = y;
        this.add = function (other) {
            this.x += other.x;
            this.y += other.y;
        }
        this.sub = function(other) {
            this.x -= other.x;
            this.y -= other.y;
        }
        this.mul = function(scalar) {
            this.x *= scalar;
            this.y *= scalar;
        }
        this.div = function(scalar) {
            this.x /= scalar;
            this.y /= scalar;
        }
        this.distance = function(other){
            return Math.sqrt((other.x-this.x)*(other.x-this.x)+(other.y-this.y)*(other.y-this.y));
        }
        this.zero = function(){
            return new vector(0,0);
        }
        this.length = function(){
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        this.normalize = function(){
            //return new vector(this.x/this.length(), this.y/this.length())
        }
    }

    function Enemy(player){
        this.maxLife = 20;
        this.life = this.maxLife;
        this.radius = enemyRadius;
        this.center = new vector(width/2 - this.radius, Math.random()*height);
        this.speed = 1;
        this.opponent = player;
        this.lvl = 1;
        if(player.number === 1){
            this.image = alienEnemyImage;
        } else {
            this.image = humanEnemyImage;
        }

        this.direction = player.number;
        this.draw = function(){
            ctx.drawImage(this.image, this.center.x-this.radius, this.center.y-this.radius, this.radius*2, this.radius*2);
        }
        this.move = function(){
            this.center.x -= this.direction * this.speed;
        }
        this.collide = function(){
            if(this.center.y-this.radius<this.opponent.center.y+playerRadius || this.center.y+this.radius>this.opponent.center.y-playerRadius){
                if(this.center.distance(this.opponent.center)<=this.radius+playerRadius){
                    this.opponent.die();
                    this.setPosition();
                }
            }
        }
        this.update = function(){
            this.move();
            this.boundWall();
            this.collide();
        }
        this.setPosition = function(){
            this.center = new vector(width/2 - this.radius, Math.random()*height);
            this.life = this.maxLife;
            this.opponent.findClosest();
        }
        this.getHit = function(damage){
            this.life-=damage;
            if(this.life <= 0){
                this.setPosition();
                this.opponent.addScore(1);
                this.opponent.addExp(this.lvl);
            }
        }
        this.boundWall = function(){
            if (this.center.y + this.radius >= height) {
                this.setPosition();
            } else if (this.center.y -this.radius < 0) {
                this.setPosition();
            }
            if (this.center.x + this.radius > width) {
                this.setPosition();
            } else if (this.center.x - this.radius < 0) {
                this.setPosition();
            }
        }
        this.lvlUp = function(){
            this.lvl++;
            this.radius += this.radius/10;
            this.maxLife+=5;
            this.speed += 0.2;
        }
    }
    function Projectle(player) {
        this.center = new vector(0, 0);
        this.active = false;
        this.direction = player.number;
        this.owner = player;
        this.speed = 8;
        this.damage = 10;
        if(player.number === 1){
            this.image = hProj1;
        } else {
            this.image = aProj1;
        }
        this.draw = function () {
            if(this.active){
                ctx.drawImage(this.image, this.center.x-projectileRadius, this.center.y-projectileRadius, projectileRadius*2, projectileRadius*2);
            }   
        }
        this.move = function() {
            this.center.x += this.direction * this.speed;
        }
        this.boundWall = function(){
            if (this.center.y + projectileRadius >= height) {
                this.active = false;
            } else if (this.center.y -projectileRadius < 0) {
                this.active = false;
            }
            if (this.direction === 1 && this.center.x + projectileRadius > width/2 - enemyRadius) {
                this.active = false;
            } else if (this.direction === -1 && this.center.x - projectileRadius < width/2 + enemyRadius) {
                this.active = false;
            }
        }
        this.shoot = function(){
            if(this.direction === 1)
                this.center = new vector(this.owner.center.x + projectileRadius + playerRadius, this.owner.center.y);
            else
                this.center = new vector(this.owner.center.x - projectileRadius - playerRadius, this.owner.center.y);
            this.active = true;
        }
        this.collide = function(){
            for(x=0;x<this.owner.enemies.length; x++){
                var enemy = this.owner.enemies[x];
                if(this.center.y > enemy.center.y - enemy.radius && this.center.y < enemy.center.y + enemy.radius){
                    if(this.center.distance(enemy.center)<projectileRadius+enemy.radius){
                        enemy.getHit(this.damage);
                        this.active = false;
                    }
                }

            }
        }
        this.update = function() {
            if(this.active){

                this.move();
                this.collide();
                this.boundWall();
            }
        }
    }

    //players

    

    function Player(number) {
        if(number === 1){
            this.image = humanImage;
        } else{
            this.image = alienImage;
        }
        this.speed = height / aistupidity;
        this.number = number;
        this.center = new vector(1.5*playerRadius, height/2-playerRadius);
        this.aible = true;
        this.up = false;
        this.down = false;
        this.score = 0;
        this.maxProjectiles = 50;
        this.lastLeveled = -1;
        this.exp = 0;
        this.lvl = 1;
        this.cooldownSpeed = 0;
        this.deaths = 0;
        this.maxTimer = 20;

        this.projectiles = [];
        this.enemies = [];
        this.enemies[0] = new Enemy(this);
        this.closest = this.enemies[0];
        this.shootTimer = 0;
        

        for(var x = 0; x<this.maxProjectiles; x++){
            this.projectiles[x] = new Projectle(this);
        }
        this.draw = function () {
            ctx.drawImage(this.image, this.center.x-playerRadius, this.center.y-playerRadius, playerRadius*2, playerRadius*2);
            for(var x = 0; x<this.maxProjectiles; x++){
                this.projectiles[x].draw();
            }
            for(var x = 0; x<this.enemies.length; x++){
                this.enemies[x].draw();
            }
        }
        this.boundWall = function(){
            if (this.center.y + playerRadius >= height)
                this.center.y = height - playerRadius;
            else if (this.center.y - playerRadius < 0)
                this.center.y = playerRadius;
        }
        this.move = function (dir) {
            if (dir === "up")
                this.center.y -= this.speed;
            else if (dir === "down")
                this.center.y += this.speed;
        }
        this.fire = function(){
            if(this.shootTimer <= 0){
                this.firing = false;
                this.shootTimer = this.maxTimer - this.cooldownSpeed;
                for(var x = 0; x<this.maxProjectiles; x++){
                    if(!this.projectiles[x].active){
                        this.projectiles[x].shoot(number);
                        break;
                    }
                }
            }
        }
        this.cooldown = function(){
            if(this.shootTimer > 0)
                this.shootTimer--;
        }

        this.findClosest = function(){
            var distFromClosest = this.center.distance(this.closest.center);
            for(var i=0; i<this.enemies.length; i++){
                var distToCompare = this.center.distance(this.enemies[i].center)
                if(distToCompare > playerRadius + this.enemies[i].radius && distToCompare <=  distFromClosest){
                    this.closest = this.enemies[i];
                    distFromClosest = this.center.distance(this.closest);
                }
            }
        }
        this.ai = function () {
            if (this.aible) {
                if (this.center.y > this.closest.center.y+this.speed+1) {
                    this.move("up");
                } else if (this.center.y < this.closest.center.y-this.speed-1) {
                    this.move("down");
                } else{
                    this.fire();
                }
            }
            
        }
        this.update = function(){
            if(this.firing){
                this.fire();
            }
            for(var x = 0; x<this.maxProjectiles; x++){
                this.projectiles[x].update();
            }
            for(var x = 0; x<this.enemies.length; x++){
                this.enemies[x].update();
            }
            this.ai();
            this.boundWall();
            this.cooldown();
        }
        this.addScore = function(points) {
            this.score+= points;
            if(this.score%10===0){
                if(this.enemies.length < maxEnemies)
                    this.enemies.push(new Enemy(this));
                else{
                    this.lastLeveled++;
                    if(this.lastLeveled === maxEnemies){
                        this.lastLeveled = 0;
                    }
                    this.enemies[this.lastLeveled].lvlUp();
                }
            }
            redrawStats(this);
        }
        this.lvlUp = function(){
            this.lvl++;
            this.speed+=this.speed/15;
            this.cooldownSpeed+=0.2;
            for(var x = 0; x<this.projectiles.length; x++){
                this.projectiles[x].damage += this.projectiles[x].damage/5;
            }
            if(this.lvl===10){
                for(var x = 0; x<this.projectiles.length; x++){
                    if(this.number === 1)
                        this.projectiles[x].image = hProj2;
                    else
                        this.projectiles[x].image = aProj2;
                }
            }
            else if(this.lvl === 20){
                for (var x = 0; x < this.projectiles.length; x++) {
                    if(this.number === 1)
                        this.projectiles[x].image = hProj3;
                    else
                        this.projectiles[x].image = aProj3;
                }
            }
        }
        this.addExp = function(points){
            this.exp+= points*30/this.lvl;
            if(this.exp>=this.lvl*100){
                this.lvlUp();
            }
        }
        this.die = function(){
            this.center.y = height/2-playerRadius;
            if(!this.aible){
                this.deaths++;
                this.speed-=this.speed/10;
                this.cooldownSpeed-=0.2;
                for(var x = 0; x<this.projectiles.length; x++){
                    this.projectiles[x].damage -= this.projectiles[x].damage/10;
                }
            }
        }
        
    }

    function prepare() {
        ctx.fillRect(0, 0, width, height);
        update();
    }

    function update() {
        p2.update();
        p1.update();
        control();
        touchControl();
        draw();
    }

    function draw(){
        p1.draw();
        p2.draw();
        requestAnimFrame(prepare);
    }

    function drawInstructions(){
        drawInstLeft();
        drawInstRight();
        drawStats(p1);
        drawStats(p2);
    }

    function drawStats(player){
        var textCanvas = document.createElement('canvas');
        textCanvas.id = player.number + 'stats';
        textCanvas.width = 136;
        textCanvas.height = 40;
        if(player.number === 1)
            textCanvas.style.left = "16px";
        else
            textCanvas.style.left = (width-144) +"px";
        textCanvas.style.top = 36 + "px";
        textCanvas.style.position = "absolute";
        //textCanvas.style.border = "1px solid white";
        document.body.appendChild(textCanvas);
        var textContext = textCanvas.getContext('2d');
        textContext.font = font;
        textContext.fillStyle = whiteFill;
        redrawStats(player);
    }

    function redrawStats(player){
        var textContext = document.getElementById(player.number + 'stats').getContext('2d');
        textContext.clearRect ( 0 , 0 , 144 , 40 );
        textContext.fillText('Score: ' + player.score, 2, 12);
        textContext.fillText('Level: ' + player.lvl + ' Exp: ' + Math.floor(player.exp-(player.lvl-1)*100), 2, 24);
        textContext.fillText('Deaths: ' + player.deaths, 2, 36);
    }

    function drawInstLeft(){
        var instLeft = document.createElement('canvas');
        instLeft.width = 160;
        instLeft.height = 40;
        instLeft.style.left = "16px";
        instLeft.style.top = height-36 + "px";
        instLeft.style.position = "absolute";
        instLeft.style.border = "1px solid white";
        document.body.appendChild(instLeft);
        var ilctx = instLeft.getContext('2d');
        ilctx.font = font;
        ilctx.fillStyle = whiteFill;
        ilctx.fillText('Instructions Keyboard:', 2, 12);
        ilctx.fillText('Shoot: D, Left Arrow', 2, 24);
        ilctx.fillText('Move: W, S, Up, Down', 2, 36);
    }
    function drawInstRight(){
        var instRight = document.createElement('canvas');
        instRight.width = 160;
        instRight.height = 40;
        instRight.style.left = width-160 + "px";
        instRight.style.top = height-36 + "px";
        instRight.style.position = "absolute";
        instRight.style.border = "1px solid white";
        document.body.appendChild(instRight);
        var irctx = instRight.getContext('2d');
        irctx.font = font;
        irctx.fillStyle = whiteFill;
        irctx.fillText('Instructions Touch: ', 2, 12);
        irctx.fillText('Shoot: Near Center', 2, 24);
        irctx.fillText('Move: Above/Below half', 2, 36);
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

    
