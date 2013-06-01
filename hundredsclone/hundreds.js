//sources: http://msdn.microsoft.com/en-us/library/gg589521%28v=vs.85%29.aspx
//http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
var canvas;
var ctx;
var width;
var height;
var fps;
var thisLoop;
var lastLoop;
var numObjects;
var o;
var startingRadius;
var gridWidth ;
var gridHeight;
var grid;
var ballImage;
var redImage;
var totalPoints ;

function init() {
    loadContent();
    width = window.innerWidth - 30;
    height = window.innerHeight - 45;
    startingRadius = width*height/30000;
    gridHeight = height/4;
    gridWidth = width/4;
    gridHeight = height/4;
    startGame();

}
function startGame(){
    numObjects = prompt("Number of objects:");
    o = new Array(numObjects);
        // for (var w = 0; w <= (width/gridWidth)-1; w++){
        //     for(var h = 0; h<= (height/gridHeight)-1; h++){
        //         grid[w,h] = new rectangle(w*gridWidth, h*gridHeight, gridWidth, gridHeight);
        //     }
        // }
        for (var x = 0; x < numObjects; x++) {
            o[x] = new object(x);
        }
        totalPoints = 0;
        fps = 0;
        thisLoop = new Date;
        lastLoop = new Date;
        drawCanvas();
    }


    function loadContent(){
        ballImage = new Image();
        redImage = new Image();
        ballImage.src = 'Images/ball.png';
        redImage.src = 'Images/redBall.png';

    }
    //canvas
    function drawCanvas() {
        canvas = document.createElement('canvas');
        canvas.setAttribute("id", "canvas");
        canvas.setAttribute("style", "border: 1px solid white;");
        canvas.addEventListener('mousedown', mousedown, false);
        canvas.addEventListener('touchstart', touch, false);
        canvas.addEventListener('touchmove', function(event) {
            event.preventDefault();
        }, false); 
        canvas.width = width;
        canvas.height = height;
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.font = 'normal ' + 14 + 'px Lucida Console';
        prepare();
    }
    
    function mousedown(ev) {
        this.pos = new vector(ev.clientX - canvas.offsetLeft, ev.clientY - canvas.offsetTop)
        for (var x = 0; x < numObjects; x++) {
            if(this.pos.distance(o[x].center)<o[x].radius){
                o[x].pressed = true;
                o[x].image = redImage;
            }
        }
        canvas.addEventListener('mouseup', mouseup, false);
    }

    function mouseup(ev){
        for (var x = 0; x < numObjects; x++) {
            o[x].pressed = false;
            o[x].image = ballImage;
        }
    }
    function touch(ev){
       this.pos = new vector(ev.changedTouches[0].pageX - canvas.offsetLeft, ev.changedTouches[0].pageY - canvas.offsetTop)
       for (var x = 0; x < numObjects; x++) {
           if(this.pos.distance(o[x].center)<o[x].radius){
               o[x].pressed = true;
               o[x].image = redImage;
           }
       }
       canvas.addEventListener('touchend', touchup, false);
   }
   function touchup(ev){
    for (var x = 0; x < numObjects; x++) {
        o[x].pressed = false;
        o[x].image = ballImage;
    }
}



function prepare() {
    lastLoop = thisLoop;
    thisLoop = new Date;
    fps = 1000 / (thisLoop - lastLoop).toFixed(2);
    ctx.clearRect(0, 0, width, height);
        //ctx.font = 'normal ' + 10 + 'px Lucida Console';
        //ctx.fillText('fps' + fps, width / 2 - height / 18, height);
        totalPoints = 0;
        // for (var w = 0; w <= (width/gridWidth)-1; w++){
        //     for(var h = 0; h<= (height/gridHeight)-1; h++){
        //         grid[w,h].objects = new Array();
        //     }
        // }
        update();
    }

    function update() {
        for (var x = 0; x < numObjects; x++) {
            //addToGrids(o[x]);
            o[x].update();
        }
        // for (var w = 0; w <= (width/gridWidth)-1; w++){
        //     for(var h = 0; h<= (height/gridHeight)-1; h++){
        //         grid[w,h].checkCollisions();
        //     }
        // }
        draw();
    }

    function draw(){
        for (var x = 0; x < numObjects; x++) {
            o[x].draw();
            totalPoints+=o[x].points;
        }
        ctx.font = 'normal ' + 48 + 'px Lucida Console';
        ctx.fillText(totalPoints, width / 2 - 48 / 2, height/2 -48);
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

    //vector
    function vector(x, y){
        this.x = x; this.y = y;
        this.add = function (other) {
            this.x += other.x;
            this.y += other.y;
        }
        this.minus = function(other) {
            this.x -= other.x;
            this.y -= other.y;
        }
        this.mul = function(scalar) {
            this.x *= scalar;
            this.y *= scalar;
        }
        this.imul = function(scalar){
            return new vector(this.x*scalar, this.y*scalar);
        }
        this.div = function(scalar) {
            this.x /= scalar;
            this.y /= scalar;
        }
        this.idiv = function(scalar){
            return new vector(this.x/scalar, this.y/scalar);
        }
        this.distance = function(other){
            return Math.sqrt((other.x-this.x)*(other.x-this.x)+(other.y-this.y)*(other.y-this.y));
        }
        this.zero = function(){
            this.x = 0;
            this.y = 0;
        }
        this.len = function(){
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        this.normalize = function(){
            //return new vector(this.x/this.length(), this.y/this.length())
        }
    }

    //grid
    function rectangle(x, y, w, h){
        this.halfWidth = w/2;
        this.halfHeight = h/2;
        this.center = new vector(x+this.halfWidth,y+this.halfHeight);
        this.objects = new Array();
        this.checkCollisions = function(){
            if(this.objects.length > 1)
            {
                for(var i = 0; i< this.objects.length; i++){
                    for(var j = i+1; j< this.objects.length; j++){

                        if(o[i].center.distance(o[j].center) < o[j].radius+o[i].radius){
                            var temp = o[i].velocity;
                            //o[i].reset(o[j].velocity);
                            //o[j].reset(temp);
                        }
                    }
                }
            }
        }
    }
    function addToGrids(object){
        for (var w = 0; w <= (width/gridWidth)-1; w++){
            for(var h = 0; h<= (height/gridHeight)-1; h++){
                if(object.center.distance(grid[w,h].center) <= object.radius+grid[w,h].halfHeight){
                    grid[w,h].objects.push(object);
                }
            }
        }
    }

    //entities
    function object(index){
        this.maxSpeed = startingRadius/50;
        this.center = new vector(Math.random() * width, Math.random() * height);
        this.velocity = new vector(Math.random() * (this.maxSpeed+this.maxSpeed+1) - this.maxSpeed, Math.random() * (this.maxSpeed+this.maxSpeed+1)-this.maxSpeed);
        this.acceleration = new vector(0,0);
        this.radius = startingRadius;
        this.damping = -0.9;
        this.ind = index;
        this.pressed = false;
        this.points = 0;
        this.image = ballImage;
        this.move = function()
        {
            this.center.add(this.velocity);
        }
        this.draw = function () {
            ctx.drawImage(this.image, this.center.x-this.radius, this.center.y-this.radius, this.radius*2, this.radius*2);
            ctx.font = 'normal ' + this.radius/2 + 'px Lucida Console';
            ctx.fillText(this.points, this.center.x-this.radius/4, this.center.y+this.radius/4);
        }
        this.update = function(){
            this.move();
            this.collide();
            this.boundWall();
            if(this.pressed){
                this.charge();
            }
        }
        this.boundWall = function(){
            if(this.center.x+this.radius>=width){
                this.center.x = width - this.radius
                this.velocity.x *= this.damping;
            }
            else if (this.center.x-this.radius<=0) {
                this.center.x = this.radius
                this.velocity.x *= this.damping;
            }
            if(this.center.y+this.radius>=height){
                this.center.y = height - this.radius
                this.velocity.y *= this.damping;
            }
            else if (this.center.y-this.radius<=0) {
                this.center.y =  this.radius
                this.velocity.y *= this.damping;
            }
        }
        this.resetPos = function(ball){
            this.center.minus(this.velocity.imul((this.center.distance(ball.center)-(this.radius+ball.radius))/2).idiv(this.velocity.len()));
            this.velocity.mul(-1);
        }
        this.bounce = function(newVelocity){

        }
        this.collide = function(){
            for(var x = 0; x<numObjects; x++){

                if(this.ind != x)
                {
                    if(this.center.distance(o[x].center) < o[x].radius+this.radius)
                    {
                        if(this.pressed){
                            totalPoints = 0;
                            for (var x = 0; x < numObjects; x++) {
                                totalPoints+=o[x].points;
                            }
                            setHighScores(totalPoints);
                        }
                        // var temp = this.velocity;
                        // this.reset(o[x].velocity);
                        // o[x].reset(temp);
                        this.resetPos(o[x]);
                        o[x].resetPos(this);
                        //this.resetPos(this.velocity.imul((this.center.distance(o[x].center)-(this.radius+o[x].radius))/2).idiv(this.velocity.len()));
                        //o[x].resetPos(o[x].velocity.imul((o[x].center.distance(this.center)-(this.radius+o[x].radius))/2).idiv(o[x].velocity.len()));
                    }
                }
            }
        }
        this.charge = function(){
            this.points++;
            this.radius+=1.5;
        }
    }

    function setHighScores(score){
        for(var i = 1; i<=10; i++){
            if(localStorage.getItem('hundreds'+i) < score){
                var name = prompt('Enter your name:');
                for(var j = 10; j> i; j--){
                    localStorage.setItem('hundredsN'+j, localStorage.getItem('hundredsN'+(j-1)));
                    localStorage.setItem('hundreds'+j, localStorage.getItem('hundreds'+(j-1)));
                }
                localStorage.setItem('hundreds'+i, score);
                localStorage.setItem('hundredsN'+i, name);
                break;
            }
        }
        displayScores();
    }

    function resetHighScores(){
        var c = confirm('Are you sure?');
        if (c){
            for(var i = 1; i<=10; i++){
                localStorage.setItem('hundredsN'+i, '');
                localStorage.setItem('hundreds'+i, 0);
            }
            displayScores();
        }
    }

    function displayScores(){
        table = document.createElement('div');
        table.setAttribute('id', 'table');
        table.setAttribute('style', "position: absolute; left: 50%; margin-left: -100px; top: 35%; margin-top: -50px; width:200px; height:360px; background-color: grey;");
        for(var i = 1; i<=10; i++){
            table.innerHTML += '<p>'+i +')' + localStorage.getItem('hundredsN' +i) + ' --- ' + localStorage.getItem('hundreds' +i) + '</p>';
}
table.innerHTML += '<button onclick="resetHighScores()"> Reset Scores</button>'
table.innerHTML += '<button onclick="again()"> Play Again</button>'
document.body.appendChild(table);
}

function again(){
    canvas = document.getElementById('canvas');
    canvas.parentNode.removeChild(canvas);
    table = document.getElementById("table");
    table.parentNode.removeChild(table);
    init();
}
