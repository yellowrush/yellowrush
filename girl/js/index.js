

var myGameArea;
var myGamePiece;
var myObstacles = [];
var myscore;

function restartGame() {
document.getElementById("myfilter").style.display = "none";
document.getElementById("myrestartbutton").style.display = "none";
myGameArea.stop();
myGameArea.clear();
myGameArea = {};
myGamePiece = {};
myObstacles = [];
myscore = {};
document.getElementById("canvascontainer").innerHTML = "";
startGame()
}

function startGame() {
    myGameArea = new gamearea();
    myGamePiece = new component(10, 10, "👧", 10, 75, "text");
    myscore = new component("15px", "Consolas", "black", 220, 25, "text");
    myGameArea.start();
}

function textureFill(imageTexture) {
  // var woodfill = ctx.createPattern(imageTexture, "repeat-x");
  // var woodfill = ctx.createPattern(imageTexture, "repeat-y");
  // var woodfill = ctx.createPattern(imageTexture, "no-repeat");
  var woodfill = ctx.createPattern(imageTexture, "repeat");
  ctx.strokeStyle = woodfill;
  ctx.strokeText('Hello World!', 20, 200);

  // fill rectangle
  ctx.fillStyle = woodfill;
  ctx.fillRect(60, 240, 260, 440);
}
function gamearea() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 320;
    this.canvas.height = 180;
    document.getElementById("canvascontainer").appendChild(this.canvas);
    this.context = this.canvas.getContext("2d");
    this.pause = false;
    this.frameNo = 0;
    this.start = function() {
        this.interval = setInterval(updateGameArea, 20);
    }
    this.stop = function() {
        clearInterval(this.interval);
        this.pause = true;
    }
    this.clear = function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
function loaded(textureFill) {
  // delay to image loaded
  setTimeout(textureFill, 1000/30);
}

function component(width, height, color, x, y, type) {

    this.type = type;
    if (type == "text") {
        this.text = color;
    }
    this.score = 0;    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
            ctx.textAlign="center";
            ctx.textBaseline = "middle";
        } else {
            var imageTexture = null;
            imageTexture = document.createElement('img');
            imageTexture.src = "https://box.kancloud.cn/2016-05-17_573adb37539f1.jpg";
            var woodfill = ctx.createPattern(imageTexture, "repeat");
            ctx.fillStyle = woodfill;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, y, min, max, height, gap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            document.getElementById("myfilter").style.display = "block";
            document.getElementById("myrestartbutton").style.display = "block";
            return;
        }
    }
    if (myGameArea.pause == false) {
        myGameArea.clear();
        myGameArea.frameNo += 1;
        myscore.score +=1;
        if (myGameArea.frameNo == 1 || everyinterval(150)) {
            x = myGameArea.canvas.width;
            y = myGameArea.canvas.height - 100;
            min = 20;
            max = 100;
            height = Math.floor(Math.random()*(max-min+1)+min);
            min = 50;
            max = 100;
            gap = Math.floor(Math.random()*(max-min+1)+min);
            myObstacles.push(new component(10, height, "#e60000", x, 0));
            myObstacles.push(new component(10, x - height - gap, "#e60000", x, height + gap));
        }
        for (i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].x += -1;
            myObstacles[i].update();
        }
        myscore.text="💸:" + myscore.score + "￥";
        myscore.update();
        myGamePiece.x += myGamePiece.speedX;
        myGamePiece.y += myGamePiece.speedY;
        myGamePiece.update();
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function moveup(e) {
    myGamePiece.speedY = -1;
}

function movedown() {
    myGamePiece.speedY = 1;
}

function moveleft() {
    myGamePiece.speedX = -1;
}

function moveright() {
    myGamePiece.speedX = 1;
}

function clearmove(e) {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}
startGame();
