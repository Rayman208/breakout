var gameField = document.getElementById("gameField");
var graphics = gameField.getContext("2d");

var ballR = 10;
var ballX = gameField.width/2;
var ballY = gameField.height/2+ballR*4;
var ballDx = ballR/4;
var ballDy = ballR/4;

var rocketW = ballR*10;
var rocketH = ballR*2;
var rocketX = gameField.width/2-rocketW/2;
var rocketY = gameField.height - rocketH;
var rocketDx = rocketW/25;
var rocketDirection = 0;
//0:stop -1:left 1:right

var bricksMargin=30;
var bricksXoffset=80;
var bricksYoffset=50;

var brickW=ballR*6;
var brickH=ballR*2;
var brickRows=4;
var brickColumns=5;
var bricks=[];

var lives=3;

function createBricks() {
    var k=0;
    for (var i=0;i<brickRows;i++)
    {
        for (var j=0;j<brickColumns;j++)
        {
            bricks[k]=
                {
                  x:j*(brickW+bricksMargin)+bricksXoffset,
                  y:i*(brickH+bricksMargin)+bricksYoffset
                };
            k++;
        }
    }
}

function drawBall() {
    graphics.beginPath();
    graphics.arc(ballX, ballY, ballR,0, Math.PI*2);
    graphics.fillStyle="#0095DD";
    graphics.fill();
    graphics.closePath();
}

function moveBall() {
    ballX+=ballDx;
    ballY+=ballDy;
}

function collisionBallWithBorder() {
    //down side
    if(ballY+ballR>=gameField.height)
    {
        ballY = gameField.height - ballR - 1;
        ballDy = -ballDy;
        lives--;
    }
    //left side
    if(ballX-ballR<=0)
    {
        ballX = ballR + 1;
        ballDx = -ballDx;
    }
    //right side
    if(ballX+ballR>=gameField.width)
    {
        ballX = gameField.width - ballR - 1;
        ballDx = -ballDx;
    }
    //up side
    if(ballY-ballR<=0)
    {
        ballY = ballR + 1;
        ballDy = -ballDy;
    }
}

function drawRocket() {
    graphics.beginPath();
    graphics.rect(rocketX,rocketY,rocketW,rocketH);
    graphics.fillStyle="#0095DD";
    graphics.fill();
    graphics.closePath();
}
function moveRocket() {
    switch (rocketDirection)
    {
        case -1://left
            rocketX-=rocketDx;
            if(rocketX<0){rocketX=0;}
            break;
        case 1://right
            rocketX+=rocketDx;
            if(rocketX+rocketW>gameField.width)
            {
                rocketX = gameField.width-rocketW;
            }
            break;
    }
}

function keyDownHandler(e) {
    if(e.keyCode==39){rocketDirection=1;}
    if(e.keyCode==37){rocketDirection=-1;}
}
function keyUpHandler(e) {
    if(e.keyCode==39){rocketDirection=0;}
    if(e.keyCode==37){rocketDirection=0;}
}

document.addEventListener("keyup",keyUpHandler,false);
document.addEventListener("keydown",keyDownHandler,false);

function collisionBallWithRocket() {
    if(ballX>=rocketX && ballX<=rocketX+rocketW
    && ballY+ballR>=rocketY)
    {
        ballDy = -ballDy;
        ballY = rocketY - ballR - 1;
    }
}

function drawBricks() {
    for (var i=0;i<bricks.length;i++)
    {
        graphics.beginPath();
        graphics.rect(bricks[i].x,bricks[i].y,brickW,brickH);
        graphics.fillStyle="#0095DD";
        graphics.fill();

        graphics.closePath();
    }
}

function drawLives() {
    graphics.font="15px Verdana";
    graphics.fillStyle="red";
    graphics.fillText("Lives: "+lives, 10,30);
}

function gameOver() {
    if(lives==0)
    {
        clearInterval(timer);
        if(confirm("You lose! Once more?")==true)
        {
            document.location.reload();
        }
    }
    else if (bricks.length==0)
    {
        clearInterval(timer);
        if(confirm("You win! Once more?")==true)
        {
            document.location.reload();
        }
    }
}

function collisionBallWithBricks() {
    for (var i=0;i<bricks.length;i++)
    {
        if( ballX>=bricks[i].x &&
            ballX<=bricks[i].x+brickW
            &&
            ballY>=bricks[i].y &&
            ballY<=bricks[i].y+brickH)
        {
            ballDy = -ballDy;
            bricks.splice(i,1);
            break;
        }
    }
}

function updateGameField() {
    graphics.clearRect(0,0,gameField.width,gameField.height);

    drawBall();
    moveBall();
    collisionBallWithBorder();

    drawRocket();
    moveRocket();
    collisionBallWithRocket();
    
    drawBricks();
    collisionBallWithBricks();

    drawLives();
    gameOver();
}

createBricks();
var timer = setInterval(updateGameField,10);


