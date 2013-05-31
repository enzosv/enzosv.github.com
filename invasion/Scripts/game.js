var canvas;
var ctx;
var width;
var height;
var colorWhite;
var colorBlack;
var baseRadius;
var delta;
var old;

var canvas;
var ctx;

var images;
var successCount;
var gameObjects;

var player1;
var player2;
var maxEnemies;

var isDemo;
function Initialize() {

    width = window.innerWidth - 15;
    height = window.innerHeight - 45;
    colorWhite = 'rgb(255,255,255)';
    colorBlack = 'rgb(0,0,0)';
    baseRadius = height * width / 300000;
    maxEnemies = height / (baseRadius * 32);
    old = getTime();
    delta = 0;
    images = [];
    successCount = 0;
    LoadContent();
    
}

function LoadContent() {

    drawCanvas();
    drawHud();
    addImage('humanImage');
    addImage('alienImage');
    addImage('humanEnemyImage');
    addImage('alienEnemyImage');
    addImage('hProj1');
    addImage('hProj2');
    addImage('hProj3');
    addImage('aProj1');
    addImage('aProj2');
    addImage('aProj3');
}
function Demo() {
    isDemo = true;
    gameObjects = [];
    player1 = new Player(findImage('humanImage'), 1);
    player1.aible = true;
    player2 = new Player(findImage('alienImage'), -1);
    player2.aible = true;
    player1.opponent = player2;
    player2.opponent = player1;
    drawStats(player1);
    drawStats(player2);
    //drawBonus(player1);
    //drawBonus(player2);
    showDemo();
}
function showDemo() {
    delta = getTime() - old;
    old = getTime();
    ctx.fillRect(0, 0, width, height);
    for (var i = 0; i < gameObjects.length; i++) {
        gameObjects[i].Update();
    }
    for (var i = 0; i < gameObjects.length; i++) {
        gameObjects[i].Draw(ctx);
    }
    if (!player1.aible || !player2.aible)
        StartGame();
    else
        requestAnimFrame(showDemo);
}

function StartGame() {
    isDemo = false;
    var load = document.getElementById('loading');
    if (load)
        load.parentNode.removeChild(load);
    var menu = document.getElementById('menu');
    menu.parentNode.removeChild(menu);
    gameObjects = [];
    player1 = new Player(findImage('humanImage'), 1);
    player2 = new Player(findImage('alienImage'), -1);
    //player2.aible = true;
    player1.opponent = player2;
    player2.opponent = player1;
    //drawStats(player1);
    //drawStats(player2);
    

    Prepare();
}
function Prepare() {
    delta = getTime() - old;
    old = getTime();
    ctx.fillRect(0, 0, width, height);
    Update();
}
function Update() {
    for (var i = 0; i < gameObjects.length; i++) {
        gameObjects[i].Update();
    }
    Draw();
}

function Draw() {
    for (var i = 0; i < gameObjects.length; i++) {
        gameObjects[i].Draw(ctx);
    }
    requestAnimFrame(Prepare);
}

