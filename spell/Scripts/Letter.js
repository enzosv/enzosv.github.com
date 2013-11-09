function Letter(l){
	this.name = l;
}

Letter.prototype.getClicked = function(){

	if(this.name === letters[correct]){
		correct++;
		ctx.clearRect(this.left, this.top, halfSize, halfSize);
		this.posX = xPositions[correct-1];
		this.posY = height*0.6;
		this.setPosition();

		this.draw();
		if(correct === letters.length)
			win();
	}
}

Letter.prototype.setPosition = function(){
	this.top = this.posY - halfSize;
	this.bottom = this.posY + fourthSize;
	this.left = this.posX - halfSize;
	this.right = this.posX + fourthSize;
}

Letter.prototype.draw = function(){
	ctx.drawImage(this.image, this.left, this.top, halfSize, halfSize);
}