

function Item(n){
	this.name = n;
}

Item.prototype.getClicked = function(){
	lettersToClick = [];
	target = this.name;
	letters = target.split('');
	for(var i = 0; i<letters.length; i++){
		lettersToClick[i] = new Letter(letters[i]);
		for(var j = 0; j < letterImages.length; j++){
			if(letterImages[j].name === letters[i]){
				lettersToClick[i].image = letterImages[j];
				break;
			}
		}
		lettersToClick[i].posX = width*0.5 + i *imageSize;
		lettersToClick[i].posY = height*0.8;
		
	}
	correct = 0;
	var middle = Math.floor((lettersToClick.length-1)*0.5);
	shuffle(lettersToClick);
	for(var i = 0; i<letters.length; i++){
		xPositions[i] = width*0.5 + (i-middle)*imageSize;
		lettersToClick[i].posX = xPositions[i];
		lettersToClick[i].setPosition();
		lettersToClick[i].draw();
	}
	// lettersToClick.sort();
	// alert(lettersToClick[0].name);
	// for(var a = 0; a<letters.length*0.5; a++){
	// 	lettersToClick[Math.floor((letters.length-a)*0.5)].posX = width*0.5- a*imageSize;
	// }
	// for(var b = Math.floor(letters.length*0.5); b<letters.length; b++){
	// 	lettersToClick[Math.floor((letters.length+b)*0.5)].posX = width*0.5+ b*imageSize;
	// }

	// for(var j = 0; j<letters.length; j++){

	// 	lettersToClick[i].setPosition();
	// 	lettersToClick[i].draw();
	// }
	
}


Item.prototype.setPosition = function(){
	this.top = this.posY - halfSize;
	this.bottom = this.posY + halfSize;
	this.left = this.posX - halfSize;
	this.right = this.posX + halfSize;
}

Item.prototype.draw = function(){
	ctx.drawImage(this.image, this.left, this.top, imageSize, imageSize);
}

function shuffle(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}