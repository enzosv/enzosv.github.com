function vector(xvalue, yvalue) {

    this.x = xvalue; this.y = yvalue;
    this.add = function (other) {
        this.x += other.x;
        this.y += other.y;
    }
    this.sub = function (other) {
        this.x -= other.x;
        this.y -= other.y;
    }
    this.mul = function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
    this.div = function (scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }
    this.distance = function (other) {
        return Math.sqrt((other.x - this.x) * (other.x - this.x) + (other.y - this.y) * (other.y - this.y));
    }
    this.zero = function () {
        return new vector(0, 0);
    }
    this.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    this.normalize = function () {
        //return new vector(this.x/this.length(), this.y/this.length())
    }
}

function addImage(name) {
    var image = new Image();
    image.src = 'Images/Invasion/' + name + '.png';
    image.name = name;
    images.push(image);
    image.addEventListener("load", function () {
        successCount++;
        if (successCount === images.length) {
            updateMenu();
        }
        else {
            updateLoading();
            
        }
    }, false);
}

function findImage(name) {
    for (var i = 0; i < images.length; i++) {
        if (images[i].name === name)
            return images[i];
    }
    return false;
}

function drawCanvas() {
    canvas = document.createElement('canvas');
    canvas.setAttribute("id", "canvas");
    canvas.setAttribute("style", "border: 1px solid white;");
    canvas.addEventListener('touchstart', touch, false);

    canvas.addEventListener('touchmove', function (event) {
        event.preventDefault();
    }, false);
    // canvas.addEventListener('onselectstart', function (event) {
    //     alert('hello');
    //     return false;
    // }, false);
    //window.addEventListener('onkeydown', onKeyDown, false);
    canvas.width = width;
    canvas.height = height;

    document.body.appendChild(canvas);

    ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, width, height);
    window.addEventListener('keyup', function (event) {
        Key.onKeyup(event);
    }, false);
    window.addEventListener('keydown', function (event) {
        Key.onKeydown(event);
    }, false);
    
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
function touch(ev) {

     this.x = ev.changedTouches[0].pageX - canvas.offsetLeft;
     if (this.x < width / 2) {
         this.y = ev.changedTouches[0].pageY - canvas.offsetTop;

         if (this.y < player1.center.y) {

             Key.pressed[87] = true;

         } else if (this.y > player1.center.y) {
             Key.pressed[83] = true;
         } else {
             delete Key.pressed[87];
             delete Key.pressed[83];
         }
     }
     else {

         Key.pressed[68] = true;
     }
    canvas.addEventListener('touchend', touchup, false);
}
function touchup(ev) {
     this.x = ev.changedTouches[0].pageX - canvas.offsetLeft;
     if (this.x < width / 2) {
         delete Key.pressed[87];
         delete Key.pressed[83];
     }
     else if (this.x > width / 2) {
         Key.pressed[68] = false;
     }
     //if(this.x > width/2){
     //    p2.up = false;
     //    p2.down = false;
     //    p2.firing = false;
     //}
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

function getTime() {
    //alert(performance.now() + performance.timing.navigationStart);
    // if(performance.now())
    //      return performance.now() + performance.timing.navigationStart
    // else
        return Date.now();
}

function setHighScores(score) {
    for (var i = 1; i <= 10; i++) {
        if (localStorage.getItem('invasion' + i) < score) {
            var name = prompt(score +'! Enter your name:');
            for (var j = 10; j > i; j--) {
                localStorage.setItem('invasionN' + j, localStorage.getItem('invasionN' + (j - 1)));
                localStorage.setItem('invasion' + j, localStorage.getItem('invasion' + (j - 1)));
            }
            localStorage.setItem('invasion' + i, score);
            localStorage.setItem('invasionN' + i, name);
            break;
        }
    }
    reviveMenu();
}

function resetHighScores() {
    var c = confirm('Are you sure?');
    if (c) {
        for (var i = 1; i <= 10; i++) {
            localStorage.setItem('invasionN' + i, '');
            localStorage.setItem('invasion' + i, 0);
        }
        reviveMenu();
    }
}

function reviveMenu() {

    hasEnded = true;
    //p1.firing =false;
    isDemo = true;

    var menuCanvas = document.createElement('canvas');
    menuCanvas.id = 'menu';
    menuCanvas.width = 200;
    menuCanvas.height = 200;
    menuCanvas.style.border = "1px dashed white";
    menuCanvas.style.left = (width / 2 - menuCanvas.width / 2) + "px";
    menuCanvas.style.top = (height / 2 - menuCanvas.height / 2) + "px";
    menuCanvas.style.position = "absolute";

    document.body.appendChild(menuCanvas);
    var menuContext = menuCanvas.getContext('2d');
    menuContext.font = 'normal ' + 16 + 'px Lucida Console';
    menuContext.fillStyle = colorWhite;
    menuContext.fillText('Charge to Play Again', 6, 192);
    for (var i = 1; i <= 10; i++) {
        if (i < 10) {
            menuContext.fillText(i + ' --- ' + localStorage.getItem('invasionN' + i), 16, 16 * (i + 1));
        } else {
            menuContext.fillText(i + ' -- ' + localStorage.getItem('invasionN' + i), 16, 16 * (i + 1));
        }
        var score = localStorage.getItem('invasion' + i);
        var scoreDisplay = score;
        if (score < 10) {
            scoreDisplay = '00' + score;
        } else if (score < 100) {
            scoreDisplay = '0' + score;
        }
        menuContext.fillText(scoreDisplay, menuCanvas.width - 44, 16 * (i + 1));
    }
    Demo();
}