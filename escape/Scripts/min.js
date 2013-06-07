function Ball(){this.radius=width*height*1e-5;this.center=new Vector(width*.5,this.radius);this.image=new Image;this.image.src="Images/ball.png";this.speedX=0;this.speedY=0;this.vertical=0;this.horizontal=0;this.accelerationX=width*.5;this.accelerationY=height*.5;this.p=0;this.draw=function(){ctx.drawImage(this.image,this.center.x-this.radius,this.center.y-this.radius,this.radius*2,this.radius*2)};this.control=function(){if(this.p===1){if(Key.isDown(Key.W)||Key.isDown(Key.S)){speedUpY(this);if(Key.isDown(Key.W)){changeDirY(this,-1)}else{changeDirY(this,1)}}else{slowDownY(this)}if(Key.isDown(Key.A)||Key.isDown(Key.D)){speedUpX(this);if(Key.isDown(Key.A)){changeDirX(this,-1)}else{changeDirX(this,1)}}else{slowDownX(this)}}else if(this.p===2){if(Key.isDown(Key.UP)||Key.isDown(Key.DOWN)){speedUpY(this);if(Key.isDown(Key.UP)){changeDirY(this,-1)}else{changeDirY(this,1)}}else{slowDownY(this)}if(Key.isDown(Key.LEFT)||Key.isDown(Key.RIGHT)){speedUpX(this);if(Key.isDown(Key.LEFT)){changeDirX(this,-1)}else{changeDirX(this,1)}}else{slowDownX(this)}}};this.move=function(){this.center.x+=this.horizontal*delta*this.speedX;this.center.y+=this.vertical*delta*this.speedY};this.boundWall=function(){if(this.center.x-this.radius<0){this.center.x=this.radius}else if(this.center.x+this.radius>width){this.center.x=width-this.radius}if(this.center.y-this.radius<0){this.center.y=this.radius}else if(this.center.y+this.radius>height){this.center.y=height-this.radius}};this.collide=function(){for(var e=0;e<guards.length;e++){var t=guards[e];if(this.center.y+this.radius>=t.center.y-t.halfHeight&&this.center.y-this.radius<=t.center.y+t.halfHeight){if(this.center.x+this.radius>=t.center.x-t.halfWidth&&this.center.x-this.radius<=t.center.x+t.halfWidth){this.center.x=width*.5;this.center.y=this.radius}}}};this.update=function(){this.control();this.move();this.collide();this.boundWall()}}function Guard(){this.center=new Vector(width*.5,height*.5);this.speed=width*.25;this.halfWidth=width*.125;this.halfHeight=height*.005;this.prisoner=prisoners[0];this.move=function(){if(Math.abs(this.prisoner.center.x-this.center.x)>this.prisoner.radius){if(this.prisoner.center.x<this.center.x){this.center.x-=delta*this.speed}else if(this.prisoner.center.x>this.center.x){this.center.x+=delta*this.speed}}};this.bound=function(){if(this.center.x-this.halfWidth<0){this.center.x=this.halfWidth}else if(this.center.x+this.halfWidth>width){this.center.x=width-this.halfWidth}};this.update=function(){if(prisoners.length>1){selectPrisoner(this)}this.move();this.bound()};this.draw=function(){ctx.fillRect(this.center.x-this.halfWidth,this.center.y-this.halfHeight,this.halfWidth*2,this.halfHeight*2)}}function Guard2(){this.center=new Vector(width*.5,height*.5);this.speed=height*.25;this.halfWidth=height*.005;this.halfHeight=width*.125;this.prisoner=prisoners[0];this.select=function(){for(var e=0;e<prisoners.length;e++){if(this.center.distance(this.prisoner.center)>this.center.distance(prisoners[e].center)){this.prisoner=prisoners[e]}}};this.move=function(){if(Math.abs(this.prisoner.center.y-this.center.y)>this.prisoner.radius){if(this.prisoner.center.y<this.center.y){this.center.y-=delta*this.speed}else if(this.prisoner.center.y>this.center.y){this.center.y+=delta*this.speed}}};this.bound=function(){if(this.center.y-this.halfHeight<height*.1){this.center.y=height*.1+this.halfHeight}else if(this.center.y+this.halfHeight>height*.9){this.center.y=height*.9-this.halfHeight}};this.update=function(){if(prisoners.length>1){this.select()}this.move();this.bound()};this.draw=function(){ctx.fillRect(this.center.x-this.halfWidth,this.center.y-this.halfHeight,this.halfWidth*2,this.halfHeight*2)}}function init(){old=Date.now();delta=0;width=window.innerWidth-15;height=window.innerHeight-45;maxSpeed=width*height*5e-4;score=0;initCanvas();gameObjects=[];guards=[];prisoners=[];prisoners[0]=new Ball;prisoners[0].p=1;gameObjects.push(prisoners[0]);prisoners[1]=new Ball;prisoners[1].p=2;gameObjects.push(prisoners[1]);for(var e=0;e<5;e++){guards[e]=new Guard;guards[e].center.y=height*(.1+.2*e);gameObjects.push(guards[e])}guards[5]=new Guard2;gameObjects.push(guards[5]);window.addEventListener("keyup",function(e){Key.onKeyup(e)},false);window.addEventListener("keydown",function(e){Key.onKeydown(e)},false)}function initCanvas(){canvas=document.createElement("canvas");document.body.appendChild(canvas);ctx=canvas.getContext("2d");setCanvas()}function setCanvas(){canvas.width=width;canvas.height=height;canvas.setAttribute("style","border: 1px solid white;");ctx.fillStyle="rgb(255,255,255)"}function prepare(){delta=(Date.now()-old)/1e3;old=Date.now();ctx.clearRect(0,0,width,height)}function update(){for(var e=0;e<gameObjects.length;e++){gameObjects[e].update()}}function draw(){for(var e=0;e<gameObjects.length;e++){gameObjects[e].draw()}}function gameLoop(){prepare();update();draw();requestAnimFrame(gameLoop)}function selectPrisoner(e){var t=2e3;for(var n=0;n<prisoners.length;n++){if(Math.abs(prisoners[n].center.y-e.center.y)<height*.2){var r=e.center.distance(prisoners[n].center);if(r<t){e.prisoner=this.prisoners[n];t=r}}}}function changeDirX(e,t){if(e.horizontal!=t){e.speedX-=delta*e.accelerationX*4;if(e.speedX<0){e.horizontal=t}}}function changeDirY(e,t){if(e.vertical!=t){e.speedY-=delta*e.accelerationY*4;if(e.speedY<0){e.vertical=t}}}function speedUpX(e){if(e.speedX<maxSpeed){e.speedX+=delta*e.accelerationX;if(e.speedX>maxSpeed){e.speedX=maxSpeed}}}function speedUpY(e){if(e.speedY<maxSpeed){e.speedY+=delta*e.accelerationY;if(e.speedY>maxSpeed){e.speedY=maxSpeed}}}function slowDownY(e){e.speedY-=delta*e.accelerationY*2;if(e.speedY<0){e.speedY=0;e.vertical=0}}function slowDownX(e){e.speedX-=delta*e.accelerationX*2;if(e.speedX<0){e.speedX=0;e.horizontal=0}}var width;var height;var canvas;var ctx;var gameObjects;var guards;var prisoners;var ball;var maxSpeed;var delta;var old;var score;var Key={pressed:{},UP:38,DOWN:40,LEFT:37,RIGHT:39,W:87,S:83,A:65,D:68,isDown:function(e){return this.pressed[e]},onKeydown:function(e){this.pressed[e.keyCode]=true},onKeyup:function(e){delete this.pressed[e.keyCode]}}