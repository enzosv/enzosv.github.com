
//sources: http://msdn.microsoft.com/en-us/library/gg589521%28v=vs.85%29.aspx
//http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
var canvas;
var ctx;
var oneScore;
var twoScore;
var width;
var height;
var num;
var random;
var aistupidity;
var b;
var p1;
var p2;
var length;

function init(){
    width = window.innerWidth - 15;
    height = window.innerHeight - 45;
    random = (Math.random() - Math.random());
    if (random - 0.6 <= 0 && random > 0)
        random += 0.6;
    else if (random + 0.6 >= 0 && random < 0)
        random -= 0.6;
    aistupidity = 150;//higher is easier
    length = height / 8;
    oneScore = 0;
    twoScore = 0;
    b = new Ball();
    p1 = new Player();
    p1.text = "W or S to join";
    p1.n = 1;
    p2 = new Player();
    p2.text = "UP or DOWN to join"
    p2.n = 2;
    p2.x = width - 20;
    p2.tx = width - 10 - length * 2.5;

    drawCanvas();
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
        ctx.fillStyle = "rgb(255,255,255)";
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
        W: 87,
        S: 83,
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
        if(this.x < width/2 && this.y < height/2){
            p1.up = true;
            p1.down = false;
            p1.aible = false;
        }else if(this.x < width/2 && this.y > height/2){
            p1.up = false;
            p1.down = true;
            p1.aible = false;
        }
        if(this.x > width/2 && this.y < height/2){
            p2.up = true;
            p2.down = false;
            p2.aible = false;
        }else if(this.x > width/2 && this.y > height/2){
            p2.up = false;
            p2.down = true;
            p2.aible = false;
        }
        canvas.addEventListener('touchend', touchup, false);
    }
    function touchup(ev){
        this.x = ev.changedTouches[0].pageX - canvas.offsetLeft;
        if(this.x < width/2){
            p1.up = false;
            p1.down = false;
        }
        if(this.x > width/2){
            p2.up = false;
            p2.down = false;
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

        if (Key.isDown(Key.UP)) {
            p2.move("up");
            p2.aible = false;
        } else if (Key.isDown(Key.DOWN)) {
            p2.move("down");
            p2.aible = false;
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

    //ball
    function Ball() {
        this.dx = random * width / 140;
        this.dy = (height / 130);
        this.w = height / 75;
        this.h = this.w;
        this.x = width / 2 - this.w / 2;
        this.y = height / 2 - this.h / 2;
        this.draw = function () {
            ctx.beginPath();
            ctx.arc(
                this.x, this.y,
                this.w/2, 0, Math.PI * 2, false
                );
            ctx.fill();
        }
        this.move = function() {
            this.x += this.dx;
            this.y += this.dy;
        }
        this.boundWall = function(){
            if (this.y + this.h >= height) {
                this.y = height - this.h;
                this.dy = -this.dy;
                if (b.dy < 0)
                    b.dy -= random / 2;
                else
                    b.dy += random / 2;
            } else if (this.y < 0) {
                this.y = 0;
                this.dy = -this.dy;
                if (b.dy < 0)
                    b.dy -= random / 2;
                else
                    b.dy += random / 2;
            }
            if (this.x > width) {
                oneScore++;
                if (oneScore - 2 > twoScore) {
                    p2.aible = true;
                }
                resetBall();
            } else if (this.x < 0) {
                twoScore++;
                if (twoScore - 2 > oneScore) {
                    p1.aible = true;
                }
                resetBall();
            }
        }
        this.collide = function (p) {
            if (this.x < p.x + p.w && this.x + this.w > p.x && this.y < p.y + p.h && this.y + this.h > p.y) {
                if (p.n === 1) {
                    b.x = p.x + b.w;
                    b.dx = -b.dx;
                    if (Key.isDown(Key.S)) {
                        b.dy = (height / 130);
                        b.dx += random / 2;
                    } else if (Key.isDown(Key.W)) {
                        b.dy = -(height / 130);
                        b.dx += random / 2;
                    }
                } else if (p.n === 2) {
                    b.x = p.x - b.w;
                    b.dx = -b.dx;

                    if (Key.isDown(Key.DOWN)) {
                        b.dy = (height / 130);
                        b.dx -= random / 2;
                    } else if (Key.isDown(Key.UP)) {
                        b.dy = -(height / 130);
                        b.dx -= random / 2;
                    }
                }
            }
        }
        this.update = function() {
            this.move();
            if(this.x<width/6 || this.x > width*5/6 || this.y <height/6 || this.y > height*5/6){
                if(this.x<width/6)
                    this.collide(p1);
                else if(this.x> width*5/6)
                    this.collide(p2);

                this.boundWall();
            }
            this.draw();
        }
    }

    //players

    

    function Player() {
        this.speed = height / aistupidity;
        this.x = 10;
        this.y = height / 2 - length;
        this.w = b.w - 1;
        this.h = length;
        this.aible = true;
        this.n = num;
        this.text = "";
        this.tx = this.x;

        this.up = false;
        this.down = false;
        this.draw = function () {
            if (this.y + this.h >= height)
                this.y = height - this.h;
            else if (this.y < 0)
                this.y = 0;
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
        this.move = function (dir) {
            if (dir === "up")
                this.y -= this.speed;
            else if (dir === "down")
                this.y += this.speed;
        }
        this.ai = function () {
            if (this.aible) {
                this.speed = height / aistupidity;
                ctx.font = 'normal ' + length / 5 + 'px Lucida Console';
                ctx.fillText(this.text, this.tx, height - 20);
                if ((b.dx < 0 && this.x < width / 2 && b.x < width / 2) || (b.dx > 0 && this.x > width / 2 && b.x > width / 2)) {//easier one
                    //if ((b.dx < 0 && this.x < width / 2) || (b.dx > 0 && this.x > width / 2)) {
                        if (this.y + this.h / 2 > b.y) {
                            this.move("up");
                        } else if (this.y - this.h < b.y) {
                            this.move("down");
                        }
                }//else if (this.y > height / 2 - length) {
                //this.move("up");
                //} else if (this.y < height / 2 - length) {
                //this.move("down");
                //}
            } else {
                this.speed = length / 10;
            }
        }
    }

    //game
    

    function resetBall() {
        b.x = width / 2 - 5;
        b.y = height / 2 - 5;
        b.dx = this.dx = random * width / 140;
        b.dy = height / 130;
    }

    function prepare() {
        ctx.clearRect(0, 0, width, height);
        ctx.font = 'normal ' + length / 2 + 'px Lucida Console';
        ctx.fillText(oneScore + ' - ' + twoScore, width / 2 - length / 2, length);
        random = (Math.random() - Math.random());
        if (random - 0.6 <= 0 && random > 0)
            random += 0.6;
        else if (random + 0.6 >= 0 && random < 0)
            random -= 0.6;
        update();
    }

    function update() {
        b.update();
        p1.ai();
        p2.ai();
        p2.draw();
        p1.draw();
        control();
        touchControl();
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

    
