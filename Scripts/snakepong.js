//sources: http://msdn.microsoft.com/en-us/library/gg589521%28v=vs.85%29.aspx
//http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
window.onload = (function () {
    var canvas;
    var ctx;
    var gameLoop;
    var oneScore = 0;
    var twoScore = 0;
    var width = window.innerWidth - 30;
    var height = window.innerHeight - 30;
    var interval = 16;
    var num;
    var random = (Math.random() - Math.random());
    if (random - 0.6 <= 0 && random > 0)
        random += 0.6;
    else if (random + 0.6 >= 0 && random < 0)
        random -= 0.6;
    var aistupidity = 150;
    //higher is easier

    //canvas
    function drawCanvas() {
        var canvas = document.createElement('canvas');
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

        //gameLoop = setInterval(update, interval);
        update();

    }

    //taken from http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
    var Key = {
        pressed: {},
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 29,
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

    //function control() {
    //    if (Key.isDown(Key.W)) {
    //        p1.move("up");
    //        p1.aible = false;
    //    } else if (Key.isDown(Key.S)) {
    //        p1.move("down");
    //        p1.aible = false;
    //    } else if (Key.isDown(Key.A)) {
    //        p1.move("left");
    //        p1.aiable = false;
    //    } else if (Key.isDown(Key.D)) {
    //        p1.move("right");
    //        p1.aible = false;
    //    }

    //    if (Key.isDown(Key.UP)) {
    //        p2.move("up");
    //        p2.aible = false;
    //    } else if (Key.isDown(Key.DOWN)) {
    //        p2.move("down");
    //        p2.aible = false;
    //    } else if (Key.isDown(Key.LEFT)) {
    //        p2.move("left");
    //        p2.aiable = false;
    //    } else if (Key.isDown(Key.RIGHT)) {
    //        p2.move("right");
    //        p2.aible = false;
    //    }

        //ball
        function Ball() {
            this.dx = random * width / 140;
            this.dy = (height / 130);
            this.w = height / 75;
            this.h = this.w;
            this.x = width / 2 - this.w / 2;
            this.y = height / 2 - this.h / 2;
            this.draw = function () {
                //b.collide(p1);
                //b.collide(p2);
                ctx.fillRect(this.x, this.y, this.w, this.h);

                this.x += this.dx;
                this.y += this.dy;
                if (this.y + this.h > height) {
                    this.y = height - this.h;
                    this.dy = -this.dy;
                } else if (this.y < 0) {
                    this.y = 0;
                    this.dy = -this.dy;
                }
                if (this.x + this.w > width) {
                    this.x = width - this.w;
                    this.dx = -this.dx;
                } else if (this.x < 0) {
                    this.x = 0;
                    this.dx = -this.dx;
                }
            }
            //this.collide = function (p) {
            //    if (this.x < p.x + p.w && this.x + this.w > p.x && this.y < p.y + p.h && this.y + this.h > p.y) {
            //        if (p.n === 1) {
            //            b.x = p.x + b.w;
            //            b.dx = -b.dx;
            //            if (Key.isDown(Key.S)) {
            //                b.dy = (height / 130);
            //                b.dx += random / 2;
            //            } else if (Key.isDown(Key.W)) {
            //                b.dy = -(height / 130);
            //                b.dx += random / 2;
            //            }
            //        } else if (p.n === 2) {
            //            b.x = p.x - b.w;
            //            b.dx = -b.dx;

            //            if (Key.isDown(Key.DOWN)) {
            //                b.dy = (height / 130);
            //                b.dx -= random / 2;
            //            } else if (Key.isDown(Key.UP)) {
            //                b.dy = -(height / 130);
            //                b.dx -= random / 2;
            //            }
            //        }
            //    }
            //}
        }

        //players

        var length = height / 9;

        //game
        var b = new Ball();


        function prepare() {
            ctx.clearRect(0, 0, width, height);
        }

        function update() {
            prepare();
            b.draw();
            
            //control();
            requestAnimFrame(update);
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

        drawCanvas();

    }
);
