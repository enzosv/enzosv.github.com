//sources: http://msdn.microsoft.com/en-us/library/gg589521%28v=vs.85%29.aspx
//http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
var canvas;
var ctx;
var width;
var height;
var num;
var random;
var aistupidity;
var b;
var p1;
var p2;
var length;

var particles;
var damping;
var limit;
var radius;
var speed;

function init() {
    width = window.innerWidth - 15;
    height = window.innerHeight - 45;
    random = (Math.random() - Math.random());
    if (random - 0.6 <= 0 && random > 0)
        random += 0.6;
    else if (random + 0.6 >= 0 && random < 0)
        random -= 0.6;
    aistupidity = 120;//higher is easier
    length = height / 8;
    oneScore = 0;
    twoScore = 0;
    b = new Ball();
    p1 = new Player();
    p1.n = 1;
    p2 = new Player();
    p2.n = 2;
    p2.x = width - 20;


    p = [];
    damping = 0.5;
    radius = height / 200;
    speed = width * 2 / height;
    limit = Math.random() * 120;
    for (var x = 0; x < limit; x++) {
        p[x] = new Particle();

    }

    drawCanvas();
    drawMenu();

}
//canvas
function drawCanvas() {
    canvas = document.createElement('canvas');
    canvas.setAttribute("id", "canvas");
    canvas.setAttribute("style", "border: 1px solid white;");

    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    //ctx.fillStyle = "rgb(255,255,255)";

    prepare();

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
            this.w / 2, 0, Math.PI * 2, false
            );
        ctx.fill();
    }
    this.move = function () {
        this.x += this.dx;
        this.y += this.dy;
    }
    this.boundWall = function () {
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
            } else if (p.n === 2) {
                b.x = p.x - b.w;
                b.dx = -b.dx;
            }
        }
    }
    this.update = function () {
        this.move();
        if (this.x < width / 6 || this.x > width * 5 / 6 || this.y < height / 6 || this.y > height * 5 / 6) {
            if (this.x < width / 6)
                this.collide(p1);
            else if (this.x > width * 5 / 6)
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
            if ((b.dx < 0 && this.x < width / 2) || (b.dx > 0 && this.x > width / 2)) {
                if (this.y + this.h / 2 > b.y) {
                    this.move("up");
                } else if (this.y - this.h < b.y) {
                    this.move("down");
                }
            }
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
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgb(255,255,255)";
    random = (Math.random() - Math.random());
    if (random - 0.6 <= 0 && random > 0)
        random += 0.6;
    else if (random + 0.6 >= 0 && random < 0)
        random -= 0.6;
    var bpos = new Vector(b.x, b.y);
    for (var x = 0; x < limit; x++) {
        for (var y = 0; y < limit; y++) {
            var vec = p[x].pos.sub(p[y].pos);
            var length2 = vec.length();

            if (length2 > radius * 10) {
                vec.div(Math.pow(length2, 3) / 9);
                p[y].acl.add(vec);
                p[x].acl.isub(vec);
            }
        }
        vec = p[x].pos.sub(bpos);
        length2 = vec.length();

        if (length2 > radius * 10) {
            vec.div(Math.pow(length2, 3) / 4);
            p[x].acl.add(vec);
        }
    }
    update();
}

function update() {
    b.update();
    p1.ai();
    p2.ai();
    p2.draw();
    p1.draw();
    for (var x = 0; x < p.length; x++) {
        p[x].draw();
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
}

function Particle() {
    this.pos = new Vector(Math.random() * width, Math.random() * height);
    this.vel = new Vector(Math.random() * (speed + speed + 1) - speed, Math.random() * (speed + speed + 1) - speed);
    this.acl = new Vector(0, 0);

    this.move = function () {
        this.vel.add(this.acl);
        this.pos.add(this.vel);
        if (this.pos.x > width) {
            this.pos.x = width;
            this.vel.x *= -damping;
        }
        else if (this.pos.x < 0) {
            this.pos.x = 0;
            this.vel.x *= -damping;
        }
        if (this.pos.y > height) {
            this.pos.y = height;
            this.vel.y *= -damping;
        }
        else if (this.pos.y < 0) {
            this.pos.y = 0;
            this.vel.y *= -damping;
        }
        this.acl.zero();
    }
    this.draw = function () {
        ctx.beginPath();
        ctx.arc(
            this.pos.x, this.pos.y,
            radius, 0, Math.PI * 2, false
            );
        ctx.fill();
        this.move();
    }
}

function drawMenu() {
    var menuCanvas = document.createElement('canvas');
    menuCanvas.id = 'menu';
    menuCanvas.width = 200;
    menuCanvas.height = 256;
    menuCanvas.style.border = "1px dashed white";
    menuCanvas.style.left = (width / 2 - menuCanvas.width / 2) + "px";
    menuCanvas.style.top = (height / 2 - menuCanvas.height / 2) + "px";
    menuCanvas.style.position = "absolute";

    document.body.appendChild(menuCanvas);
    var menuContext = menuCanvas.getContext('2d');
    menuContext.fillStyle = 'rgb(255,255,255)';
    menuContext.font = 'normal ' + 16 + 'px Lucida Console';
    var indexLink = addHSLink('Navigate', 0);
    var invasionLink = addHSLink('Invasion', 1);
    var hundredsLink = addHSLink('Hundreds', 2);
    indexLink.onclick = function () {
        
    }
    invasionLink.onclick = function () {
        updateMenu('invasion');
        return false;
    }
    hundredsLink.onclick = function () {
        updateMenu('hundreds');
        return false;
    }
    showLinks();
    
}

function addHSLink(text, num) {
    var a = document.createElement('a');
    var t = document.createTextNode(text + ' ');
    a.appendChild(t);
    a.href = 'index.html';
    a.style.left = width / 2 - 96 + num*64 + 'px';
    a.style.top = height / 2 + 96  + 'px';
    a.style.position = "absolute";
    body.appendChild(a);
    return a;
}

function updateMenu(game) {
    removeLinks();
    var menuContext = document.getElementById('menu').getContext('2d');
    menuContext.textAlign = 'center';
    menuContext.clearRect(0, 0, 200, 200);
    menuContext.fillText(game.toUpperCase(), 100, 16);
    menuContext.textAlign = 'left';
    for (var i = 1; i <= 10; i++) {
        if (i < 10) {
            menuContext.fillText(i + ' --- ' + localStorage.getItem(game+'N' + i), 16, 16 * (i + 1) +16);
        } else {
            menuContext.fillText(i + ' -- ' + localStorage.getItem(game+'N' + i), 16, 16 * (i + 1)+16);
        }
        var score = localStorage.getItem(game + i);
        var scoreDisplay = score;
        if (score < 10) {
            scoreDisplay = '00' + score;
        } else if (score < 100) {
            scoreDisplay = '0' + score;
        }
        menuContext.fillText(scoreDisplay, 156, 16 * (i + 1)+16);
    }
}

function showLinks() {
    
    var menuContext = document.getElementById('menu').getContext('2d');
    menuContext.textAlign = 'center';
    menuContext.clearRect(0, 0, 200, 200);
    menuContext.fillText('ENZOSVGAMES', 100, 16);
    addNavLink('Pong', 0);
    addNavLink('Invasion', 1);
    addNavLink('HundredsClone', 2);
    addNavLink('SnakePong', 3);
    var hellWeek = document.createElement('a');
    var hellWeekText = document.createTextNode('Hell Week by 8bitgames');
    hellWeek.appendChild(hellWeekText);
    hellWeek.href = 'http://hell-week.site44.com/';
    hellWeek.style.left = width / 2 - 88 + 'px';
    hellWeek.style.top = height / 2 - 96 + 20 * 4 + 'px';
    hellWeek.style.position = "absolute";
    hellWeek.id = 'hellWeeknl';
    body.appendChild(hellWeek);
}

function addNavLink(text, num) {
    var a = document.createElement('a');
    var t = document.createTextNode(text + ' ');
    a.appendChild(t);
    a.href = text + '.html';
    a.style.left = width / 2 - 88 + 'px';
    a.style.top = height / 2 - 96 + 20*num + 'px';
    a.style.position = "absolute";
    a.id = text + 'nl';
    body.appendChild(a);
}

function removeLinks() {
    body.removeChild(document.getElementById('Pongnl'));
    body.removeChild(document.getElementById('Invasionnl'));
    body.removeChild(document.getElementById('HundredsClonenl'));
    body.removeChild(document.getElementById('SnakePongnl'));
    body.removeChild(document.getElementById('hellWeeknl'));
}