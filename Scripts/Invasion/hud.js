var font = 'normal ' + 12 + 'px Lucida Console';
function drawKeyboardInstructions() {
    var canv = document.createElement('canvas');
    canv.width = 160;
    canv.height = 40;
    canv.style.left = "16px";
    canv.style.top = height - 32 + "px";
    canv.style.position = "absolute";
    canv.style.border = "1px solid white";
    document.body.appendChild(canv);
    var cctx = canv.getContext('2d');
    cctx.font = font;
    cctx.fillStyle = colorWhite;
    cctx.fillText('Instructions Keyboard:', 2, 12);
    cctx.fillText('Charge: D, Left Arrow', 2, 24);
    cctx.fillText('Move: W, S, Up, Down', 2, 36);
}

function drawTouchInstructions() {
    var canv = document.createElement('canvas');
    canv.width = 160;
    canv.height = 40;
    canv.style.left = width - 160 + "px";
    canv.style.top = height - 32 + "px";
    canv.style.position = "absolute";
    canv.style.border = "1px solid white";
    document.body.appendChild(canv);
    var cctx = canv.getContext('2d');
    cctx.font = font;
    cctx.fillStyle = colorWhite;
    cctx.fillText('Instructions Touch: ', 2, 12);
    cctx.fillText('Charge: Right Half', 2, 24);
    cctx.fillText('Move: Above/Below Half', 2, 36);
}

function drawStats(player) {
    var textCanvas = document.createElement('canvas');
    textCanvas.id = player.number + 'stats';
    textCanvas.width = 136;
    textCanvas.height = 40;
    if (player.number === 1)
        textCanvas.style.left = "16px";
    else
        textCanvas.style.left = (width - 144) + "px";
    textCanvas.style.top = "32px";
    textCanvas.style.position = "absolute";
    //textCanvas.style.border = "1px solid white";
    document.body.appendChild(textCanvas);
    var textContext = textCanvas.getContext('2d');
    textContext.font = font;
    textContext.fillStyle = colorWhite;
    redrawStats(player);
}


function redrawStats(player) {
    var textContext = document.getElementById(player.number + 'stats').getContext('2d');
    textContext.clearRect(0, 0, 144, 40);
    textContext.fillText('Score: ' + player.score, 2, 12);
    textContext.fillText('Level: ' + player.lvl + ' Exp: ' + Math.floor(player.exp - (player.lvl - 1) * 100), 2, 24);
    textContext.fillText('Charge: ' + player.power, 2, 36);
}

//function drawBonus(player) {
//    var textCanvas = document.createElement('canvas');
//    textCanvas.id = player.number + 'bonus';
//    textCanvas.width = 128;
//    textCanvas.height = 16;
//    if (player.number === 1)
//        textCanvas.style.left = "64px";
//    else
//        textCanvas.style.left = (width - 192) + "px";
//    textCanvas.style.top = (player.center.y+10) + "px";
//    textCanvas.style.position = "absolute";
//    //textCanvas.style.border = "1px solid white";
//    document.body.appendChild(textCanvas);
//    var textContext = textCanvas.getContext('2d');
//    textContext.font = font;
//    textContext.fillStyle = colorWhite;
//    redrawStats(player);
//}

//function updateBonus(player, message) {
//    var textContext = document.getElementById(player.number + 'bonus').getContext('2d');
//    textCanvas.style.top = (player.center.y + 10) + "px";
//    textContext.fillText(message, 0, 12);
//}

function clearBonus(player) {
    var textContext = document.getElementById(player.number + 'bonus').getContext('2d');
    textContext.clearRect(0, 0, 128, 16);
}

function drawHud() {
    drawLoading();
    drawKeyboardInstructions();
    drawTouchInstructions();
    drawMenu();
}

function drawLoading() {
    var loadCanvas = document.createElement('canvas');
    loadCanvas.id = 'loading';
    loadCanvas.width = 230;
    loadCanvas.height = 20;
    loadCanvas.style.left = (width / 2 - loadCanvas.width / 2) + "px";
    loadCanvas.style.top = (height / 2 - loadCanvas.height / 2) + "px";
    loadCanvas.style.position = "absolute";
    loadCanvas.style.border = "1px solid white";
    document.body.appendChild(loadCanvas);
    var loadContext = loadCanvas.getContext('2d');
    loadContext.font = font;
    loadContext.fillStyle = colorWhite;
    //menuContext.fillRect(0, 0, width, height);
}

function updateLoading() {
    var loadContext = document.getElementById('loading').getContext('2d');
    loadContext.clearRect(0, 0, 30, 20);
    loadContext.fillStyle = 'rgb(255,0,0)';
    loadContext.fillRect(0, 0, 30, 20);
    
    loadContext.fillRect((successCount - 1) * 20 + 30, 0, 20 * successCount, 20);
    loadContext.fillStyle = colorWhite;
    loadContext.fillText(successCount * 100 / images.length + '%', 2, 14);
    for (var x = 0; x < successCount; x++) {
        loadContext.drawImage(images[successCount - 1], (successCount - 1) * 20 + 35, 5, 10, 10);
    }
    
}

function drawMenu() {
    var menuCanvas = document.createElement('canvas');
    menuCanvas.id = 'menu';
    menuCanvas.width = 100;
    menuCanvas.height = 32;
    menuCanvas.style.left = (width / 2 - menuCanvas.width / 2) + "px";
    menuCanvas.style.top = (height / 2 + menuCanvas.height / 2) + "px";
    menuCanvas.style.position = "absolute";
    //menuCanvas.style.border = "1px solid white";
    document.body.appendChild(menuCanvas);
    var menuContext = menuCanvas.getContext('2d');
    menuContext.font = font;
    menuContext.fillStyle = colorWhite;
    menuContext.fillText('loading..', 2, 14);
   
}

function updateMenu() {
    updateLoading();
    var menuCanvas = document.getElementById('menu');
    var menuContext = menuCanvas.getContext('2d');
    menuContext.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
    menuContext.fillText('Charge to Play', 2, 12);
    //p1.aible = false;
    //p1.firing = false;
    isDemo = true;
    Demo();
}