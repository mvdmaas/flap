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

  this.updateWing(interval);
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
  flapImg.src = 'img/flap.png';

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  flap = new Flap();

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
  flap.update(interval);
}

function render(ctx) {
  flap.render(ctx);
}

startGame();