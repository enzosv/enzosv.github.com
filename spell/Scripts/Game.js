var target;
var letters;
var correct;
var images;
var letterCount;
var successCount;
var items;

var canvas;
var ctx;
var width;
var height;

var imageSize;
var halfSize;
var fourthSize;
var letterImages;
var lettersToClick;
var selectingImage;

var xPositions;

function Initialize(){
	
	width = window.innerWidth - 15;
    height = window.innerHeight - 45;
    items = [];

    images = [];
    letterImages = [];
    
    successCount = 0;
    letterCount = 0;
    selectingImage = true;
    LoadContent();
}

function LoadContent(){
	drawCanvas();
	drawLoading();
    var str = "abcdefghijklmnopqrstuvwxyz";
    for(var j=0; j<str.length; j++){
        addLetter(str.charAt(j));
    }
    for(var i = 0; i<imageNames.length; i++){
        addImage(imageNames[i]);
    }
}

function drawCanvas() {

    canvas = document.createElement('canvas');

    canvas.setAttribute("id", "canvas");
    canvas.setAttribute("style", "border: 1px solid white;");

    canvas.width = width;
    canvas.height = height;
    
    document.body.appendChild(canvas);

    ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, width, height);
}

function win(){
	drawImages();
    alert("win");
}

function addLetter(letter){
    var letterItem = new Image();

    letterItem.src = 'Images/' + letter + '.PNG';
    letterItem.name = letter;

    letterImages.push(letterItem);
    
    letterItem.addEventListener("load", function () {
        letterCount++;
        if (letterCount + successCount === imageNames.length +26) {
            drawImages();
        }
        else {
            updateLoading();
        }
    }, false);
}
function addImage(name) {

    var image = new Image();

    image.src = 'Images/' + name + '.png';
    image.name = name;

    images.push(image);
    image.addEventListener("load", function () {
        items[successCount] = new Item(name);
        items[successCount].image = image;
        successCount++;
        if (letterCount + successCount === imageNames.length + 26) {
            drawImages();
        }
        else {
            updateLoading();
        }
    }, false);
}

function drawImages(){
    ctx.clearRect(0, 0, width, height);
    lettersToClick = [];
    letters = [];
    correct = 0;
    xPositions = [];
    var load = document.getElementById('loading');
    if (load)
        load.parentNode.removeChild(load);

    var rows = 1;
    var cols = 1;
    while(items.length > rows*cols){
        if(rows < cols)
            rows++;
        else
            cols++;
    }
    var col = 0;
    var row = 0;
    if(width > height){
        imageSize = height * 0.5/cols;
    }
    else{
        imageSize = width *0.5/rows;
    }
    halfSize = imageSize *0.5;
    fourthSize = imageSize *0.25;
    

    for(var i = 0; i<items.length; i++){
        if(col < cols){
            items[i].posX = imageSize + col *imageSize*1.5;
            col++;
        }
        else{
            col = 0;
            items[i].posX = imageSize + col *imageSize*1.5;
            col++;
            row++;
        }
        items[i].posY = imageSize + row *imageSize*1.5;
        items[i].setPosition();
        items[i].draw();
    }
    

    canvas.addEventListener('click', selectItem, false);
    canvas.addEventListener('touch', selectItem, false);
}

function selectItem(event){
    var x = event.pageX,
    y = event.pageY;
    for(var i = 0; i<items.length; i++){
        if(y > items[i].top && y < items[i].bottom && x > items[i].left && x <items[i].right){
            centerImage(items[i]);
            break;
        }
    };
    for(var j = 0; j<lettersToClick.length; j++){
        if(y > lettersToClick[j].top && y < lettersToClick[j].bottom && x > lettersToClick[j].left && x <lettersToClick[j].right){
            lettersToClick[j].getClicked();
            break;
        }
    };
}

function centerImage(clickedItem){


    ctx.clearRect(0, 0, width, height);
    for(var i = 0; i<items.length; i++){
        items[i].posX = -512;
        items[i].setPosition();
    }

    clickedItem.posX = width *0.5;
    clickedItem.posY = height *0.3;
    clickedItem.setPosition();

    clickedItem.draw();
    clickedItem.getClicked();
    
}


function drawLoading() {
    var loadCanvas = document.createElement('canvas');
    loadCanvas.id = 'loading';
    loadCanvas.width = 230;
    loadCanvas.height = 20;
    loadCanvas.style.left = (width *0.5 - loadCanvas.width *0.5 ) + "px";
    loadCanvas.style.top = (height *0.5 - loadCanvas.height *0.5 ) + "px";
    loadCanvas.style.position = "absolute";
    loadCanvas.style.border = "1px solid white";
    document.body.appendChild(loadCanvas);
    var loadContext = loadCanvas.getContext('2d');

    loadContext.font = 'normal ' + 12 + 'px Lucida Console';
    loadContext.fillStyle = 'rgb(255,255,255)';

    //menuContext.fillRect(0, 0, width, height);
}

function updateLoading() {
    var loadContext = document.getElementById('loading').getContext('2d');
    loadContext.clearRect(0, 0, 230, 20);
    loadContext.fillStyle = 'rgb(255,0,0)';
    loadContext.fillRect(0, 0, (successCount+letterCount)*230/(imageNames.length+25), 20);
    
    // loadContext.fillRect((successCount - 1) * 20 + 30, 0, 100/images.length * successCount, 20);
    // loadContext.fillStyle = colorWhite;
    // loadContext.fillText(successCount * 100 / images.length + '%', 2, 14);
    // for (var x = 0; x < successCount; x++) {
    //     loadContext.drawImage(images[successCount - 1], (successCount - 1) * 20 + 35, 5, 10, 10);
    // }
    
}