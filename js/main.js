//init images
var pipeImg = new Image();
var flapImg = new Image();

//init sounds
var wingSnd   = new Audio('sounds/sfx_wing.ogg');
var scoreSnd  = new Audio('sounds/sfx_point.ogg');
var hitSnd    = new Audio('sounds/sfx_hit.ogg');

//application variables (to play with)
var pipeGap           = 150;
var pipeInterval      = 2000; //miliseconds between new pipes
var maxVelocity       = 20;
var wingFrameTime     = 50;
var gravitation       = 15;
var velocityUpLevel   = 5;
var scoredPoints      = 0;
var speed             = 1;

//application variables (unchangeble)
var canvas            = document.getElementById('canvas');
var pipes             = [];
var prevTimestamp     = null;
var flap              = null;
var flutterKeyDown    = false;
var gameOver          = false;
var hasCollided       = false;
var addPipeTime       = 0;

function Pipe(y) {
	this.x = canvas.width + pipeImg.width / 2;
	this.y = y;
}

Pipe.prototype.outOfBounds = function() {
	return this.x + pipeImg.width < 0
};
Pipe.prototype.update = function(interval) {
	this.x -= interval * (speed / 10);

  if (this.x < flap.x && !this.isCounted) {
    //update score
    this.updateScore();  
  }
};

Pipe.prototype.updateScore = function() {
  scoreSnd.currentTime = 0;
  scoreSnd.play();
  this.isCounted = true;
  scoredPoints++;
  document.getElementById("counter").innerHTML = scoredPoints;
};

Pipe.prototype.render = function(ctx) {

	this.currentX = Math.floor(this.x);
	this.currentYTopPipe = canvas.height /2 + this.y - pipeGap / 2;
	this.currentYBottomPipe = canvas.height /2 + this.y + pipeGap / 2;

	ctx.save();

  //render top pipe
	ctx.translate(this.currentX, this.currentYTopPipe);
  ctx.drawImage(pipeImg,-pipeImg.width / 2, -pipeImg.height);

  ctx.restore();
  ctx.save();

  //render bottom pipe
  ctx.translate(this.currentX, this.currentYBottomPipe);
  ctx.rotate(Math.PI);
  ctx.drawImage(pipeImg,-pipeImg.width / 2, -pipeImg.height);

  ctx.restore();
};

function Flap() {
  this.x = canvas.width / 5;
  this.y = canvas.height / 2;
  this.velocity = 0;
  this.wingIndex = 0;
  this.wingDirection = 1;
  this.wingTime = wingFrameTime;
  this.isPlaying = false;
}

Flap.prototype.update = function(interval) {
  if(this.isPlaying) {
    this.velocity -= interval / 1000 * gravitation;
    if(this.velocity < -maxVelocity)  {
      this.velocity = -maxVelocity;
    }
    this.y -= this.velocity;
  }

  if(this.hasCollision()) {
    flap.velocity = -1000;

    hitSnd.currentTime = 0;
    hitSnd.play();
    hasCollided = true;
  }
  if(hasCollided && this.y >= canvas.height) {
    this.y = canvas.height - flapImg.height;
    flap.velocity = 0;
    gameOver = true;

  }
  this.updateWing(interval);
};

Flap.prototype.hasCollision = function() {
  flapRect = {x: flap.x, y: flap.y, width: 160/3, height: 37};
  
  if(isCollisionWithWindow(flapRect)) {
    return true;
  }

  for(var i = 0; i < pipes.length; i++) {
    topPipeRect = {x: pipes[i].currentX - pipeImg.width, y: pipes[i].currentYTopPipe - pipeImg.height, width: pipeImg.width, height: pipeImg.height};
    bottomPipeRect = {x: pipes[i].currentX, y: pipes[i].currentYBottomPipe, width: pipeImg.width, height: pipeImg.height};
    
    if(isCollision(flapRect, topPipeRect) || isCollision(flapRect, bottomPipeRect)) {
      return true;
    }
  }
  return false;
};

Flap.prototype.updateWing = function(interval) {
  this.wingTime -= interval;
  if(this.wingTime < 0) {

    if(this.wingIndex ==2) {
      this.wingDirection = -1;
    } else if(this.wingIndex == 0) {
      this.wingDirection = 1;
    }
    this.wingIndex += this.wingDirection;

    this.wingTime = wingFrameTime;
  }
}

Flap.prototype.render = function(ctx) {
  ctx.save();
  ctx.translate(this.x + 160/6, this.y + 37 /2);
  ctx.rotate(-(Math.PI /2 * (this.velocity / maxVelocity)));
  ctx.drawImage(flapImg, this.wingIndex * 160/3, 0, 160/3, 37, -160/6, -37/2, 160/3, 37);
  ctx.restore();
};

Flap.prototype.flutter = function () {
  this.velocity = velocityUpLevel;
  this.isPlaying = true;
  wingSnd.currentTime = 0;
  wingSnd.play();
};

function startGame(){
  pipeImg.src = 'img/pipe.png';
  flapImg.src = 'img/flap.png';

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  flap = new Flap();
  window.addEventListener("keydown", onKeyDown, false);
  canvas.addEventListener("touchstart", onKeyDown, false);
  window.addEventListener("keyup", onKeyUp, false);
  canvas.addEventListener("touchend", onKeyUp, false);

  window.requestAnimationFrame(tick);
}

function tick(timestamp) {
	if(!prevTimestamp) {
		prevTimestamp = timestamp;
	};
	var interval = timestamp - prevTimestamp;
	
	update(interval);

  var ctx = canvas.getContext('2d');

  ctx.clearRect(0,0,canvas.width, canvas.height);
  render(ctx);

  prevTimestamp = timestamp;
  if(!gameOver) {
    window.requestAnimationFrame(tick);
  }
}

function update(interval) {

	addPipeTime -= interval;
	while(addPipeTime <= 0) {
		var y = Math.random() * (canvas.height / 2) - canvas.height / 4; 

		pipes.push(new Pipe(y));

		addPipeTime += pipeInterval;
	}

	for(var i = 0; i < pipes.length; i++) {
		pipes[i].update(interval);
	}

	while(!pipes && pipes[0].outOfBounds()) {
		pipes.unshift();	
	}
  flap.update(interval);
}

function isCollision(rect1, rect2) {
  if (rect1.x < rect2.x + rect2.width &&
   rect1.x + rect1.width > rect2.x &&
   rect1.y < rect2.y + rect2.height &&
   rect1.height + rect1.y > rect2.y) {
    return true;
  }
  return false;
}

function isCollisionWithWindow(flapRect) {
  if(flapRect.y < 0 || flapRect.y > canvas.height) {
    return true;
  }
}

function render(ctx) {
	for(var i = 0; i < pipes.length; i++) {
		pipes[i].render(ctx);
	}
  flap.render(ctx);
}

function onKeyDown(event) {;
  var keyCode = event.keyCode; 
  if(keyCode === 32 || !keyCode) {
    if(!flutterKeyDown) {
      flap.flutter();
      flutterKeyDown = true;
    }
  }
}

function onKeyUp(event) {
  var keyCode = event.keyCode; 
  if(keyCode === 32 || !keyCode) {
    flutterKeyDown = false;
  }
}

startGame();