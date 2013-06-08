var cdCanvas;
var cdCtx;
var lCtx;
var sCanvas;
var sCtx;
var cCanvas;
var cCtx;

var width;
var height;
var whiteColor;

var cdWidth;
var cdHeight;
var cdFontSize;

var timeLeft;
var arrivalTime;

var daysLeft;
var hoursLeft;
var minsLeft;
var secsLeft;

var images;
var imageCount;
var loadCounter;
var canAddImage;
function main(){
	init();
	setInterval(theLoop, 1000);
}

function init(){
	initTime();
	images = [];

	loadCounter = 0;
	canAddImage = true;
	imageCount = prefs.imageCount;

	for(var i = 0; i< imageCount; i++){
		images[i] = new Image();
		images[i].src = (i+1) + '.jpg';
		images[i].caption = captions[i];
	}
	whiteColor = prefs.whiteColor;

	createCanvas();
	resize();
}

function initTime(){
	arrivalTime = new Date(prefs.arrivalDate);
	var msPerDay = 1/86400000;
	timeLeft = arrivalTime-new Date().getTime();
	e_daysLeft = timeLeft*msPerDay;
	daysLeft = Math.floor(e_daysLeft);
	e_hoursLeft = (e_daysLeft-daysLeft)*24;
	hoursLeft = Math.floor(e_hoursLeft);
	e_minsLeft = (e_hoursLeft-hoursLeft)*60;
	minsLeft = Math.floor(e_minsLeft);
	e_secsLeft = (e_minsLeft - minsLeft)*60;
	secsLeft = Math.floor(e_secsLeft);
}

window.onresize = function(event) {
	cdCtx.clearRect(0,0,cdWidth,cdHeight);
	lCtx.clearRect(0,0,cdWidth,cdHeight);
	resize();
}

function resize(){
	width = window.innerWidth;
	height = window.innerHeight;
	if(height >= width){
		height=width*40/71;
	}

	cdWidth = width*0.75;
	cdHeight = height*0.2;
	cdFontSize = cdWidth*cdHeight*prefs.fontMultiplier;

	setCanvas();
	addImage(Math.floor(Math.random()*imageCount));
}

function createCanvas(){
	cdCanvas = document.createElement('canvas');
	document.body.appendChild(cdCanvas);

	labelCanvas = document.createElement('canvas');
	document.body.appendChild(labelCanvas);

	sCanvas = document.createElement('canvas');
	document.body.appendChild(sCanvas);

	cCanvas = document.createElement('canvas');
	document.body.appendChild(cCanvas);
}
function setCanvas(){

	cdCanvas.width = cdWidth;
	cdCanvas.height = cdHeight;
	cdCanvas.style.left = width*0.125 + "px";
	cdCanvas.style.top = height*0.15 + "px";
	cdCanvas.style.position = "absolute";
	cdCtx = cdCanvas.getContext('2d');
	cdCtx.fillStyle = whiteColor;
	cdCtx.font = 'normal ' + cdFontSize + 'px Lucida Console';
	cdCtx.textAlign = 'center';
	
	labelCanvas.width = cdWidth;
	labelCanvas.height = cdHeight*0.5;
	labelCanvas.style.left = width*0.125 + "px";
	labelCanvas.style.top = (height*0.15-labelCanvas.height) + "px";
	labelCanvas.style.position = "absolute";
	lCtx = labelCanvas.getContext('2d');
	lCtx.fillStyle = whiteColor;
	lCtx.font = 'normal ' + cdFontSize*0.25 + 'px Lucida Console';
	lCtx.textAlign = 'center';

	sCanvas.width = cdWidth;
	sCanvas.height = height*0.55;
	sCanvas.style.left = width*0.125 + "px";
	sCanvas.style.top = height*0.38 + "px";
	sCanvas.style.position = "absolute";
	//sCanvas.style.border = "1px solid white";
	sCtx = sCanvas.getContext('2d');

	cCanvas.width = cdWidth;
	cCanvas.height = cdHeight*0.3;
	cCanvas.style.left = width*0.125 + "px";
	cCanvas.style.top = height*0.93 + "px";
	cCanvas.style.position = "absolute";
	//cCanvas.style.border = "1px solid white";
	cCtx = cCanvas.getContext('2d');
	cCtx.fillStyle = whiteColor;
	cCtx.font = 'normal ' + cdFontSize *0.4 + 'px Lucida Console';
	cCtx.textAlign = 'center';

	writeLabel();
}

function writeLabel(){

	lCtx.fillText("days", labelCanvas.width*0.2, labelCanvas.height*0.9);
	lCtx.fillText("hours", labelCanvas.width*0.39, labelCanvas.height*0.9);
	lCtx.fillText("mins", labelCanvas.width*0.577, labelCanvas.height*0.9);
	lCtx.fillText("secs", labelCanvas.width*0.765, labelCanvas.height*0.9);

}

function addImage(number){
	//http://stackoverflow.com/questions/2303690/resizing-an-image-in-an-html5-canvas
	var maxWidth = cdWidth;
	var maxHeight = height*0.55;
	var wRatio = 1;
	var hRatio = 1;
	//erase
	sCtx.clearRect(0,0,sCanvas.width, sCanvas.height);
	cCtx.clearRect(0,0,cCanvas.width, cCanvas.height);

	//resize
	if(images[number].width > maxWidth)
	{
		wRatio = maxWidth/images[number].width;
	}
	if(images[number].height > maxHeight)
	{
		hRatio = maxHeight/images[number].height;
	}
	if(wRatio >= hRatio){
		images[number].width *= hRatio;
		images[number].height *= hRatio;
	}
	else{
		images[number].width *= wRatio;
		images[number].height *= wRatio;
	}

	//draw image
	sCtx.drawImage(images[number], (sCanvas.width-images[number].width)*0.5, (sCanvas.height-images[number].height)*0.5, images[number].width, images[number].height);
	//caption
	if(images[number].caption === undefined){
		images[number].caption = prefs.defaultCaption;
	}
	cCtx.fillText(images[number].caption, cCanvas.width*0.5, (cCanvas.height+cdFontSize*0.2)*0.5);
}
function theLoop(){
	countdown();
}

function countdown(){
	timeLeft = arrivalTime-new Date().getTime();
	changeSecs();
	cdCtx.clearRect(0,0,cdWidth, cdHeight);
	timer = pad2(daysLeft) + pad2(hoursLeft) + pad2(minsLeft) + pad2(secsLeft);
	cdCtx.fillText(timer, cdWidth*0.5, (cdHeight+cdFontSize)*0.4);
}

function changeSecs(){
	if(secsLeft===0){
		secsLeft = 60;
		addImage(Math.floor(Math.random()*imageCount));
		changeMins();
	}
	secsLeft--;

}

function changeMins(){
	if(minsLeft===0){
		minsLeft = 60;
		changeHours();
	}
	minsLeft--; 
}

function changeHours(){

	if(hoursLeft===0){
		hoursLeft = 24;
		changeDays();
	}
	hoursLeft--;
}

function changeDays(){
	daysLeft--;
}

function pad2(number) {
	return ((number < 10 ? '0' : '') + number) + " "
}

function changeDate(){
	message = "New Date:";
	if(localStorage.getItem('endDate') != null){
		message = "Change " + localStorage.getItem('endDate');
	}
	eDate = prompt("Date:");
	localStorage.setItem(endDate, Date.parse(eDate));
}