const video =
document.getElementById("video");

const canvas =
document.getElementById("gameCanvas");

const ctx =
canvas.getContext("2d");

const statusText =
document.getElementById("status");

const scoreText =
document.getElementById("score");

const box=20;

const rows=
canvas.width/box;

const cols=
canvas.height/box;

let snake;

let direction;

let food;

let score;

let gameStarted=false;

let gameInterval;

let lastGestureTime=0;


function resetGame(){

snake=[
{x:10,y:10}
];

direction=null;

score=0;

scoreText.innerText=
"Score: "+score;

food=createFood();

drawGame();

}

resetGame();



function createFood(){

let newFood;

do{

newFood={

x:Math.floor(
Math.random()*rows
),

y:Math.floor(
Math.random()*cols
)

};

}

while(

snake.some(

s=>s.x===newFood.x &&
s.y===newFood.y

)

);

return newFood;

}



function drawBackground(){

ctx.fillStyle="black";

ctx.fillRect(

0,
0,

canvas.width,

canvas.height

);

}



function drawGame(){

drawBackground();


// FOOD

ctx.fillStyle="red";

ctx.fillRect(

food.x*box,

food.y*box,

box,

box

);


// SNAKE

snake.forEach(

(part,index)=>{

ctx.fillStyle=

index===0

?

"yellow"

:

"lime";


ctx.fillRect(

part.x*box,

part.y*box,

box,

box

);

}

);

}



function moveSnake(){

if(!direction)
return;


let head={

...snake[0]

};


if(direction==="LEFT")
head.x--;

if(direction==="RIGHT")
head.x++;

if(direction==="UP")
head.y--;

if(direction==="DOWN")
head.y++;



if(

head.x<0 ||

head.y<0 ||

head.x>=rows ||

head.y>=cols ||

snake.some(

part=>

part.x===head.x &&

part.y===head.y

)

)

{

clearInterval(
gameInterval
);

alert(
"Game Over!\nScore: "
+score
);

gameStarted=false;

statusText.innerText=
"Show hand to restart";

resetGame();

return;

}



snake.unshift(head);



if(

head.x===food.x &&

head.y===food.y

){

score++;

scoreText.innerText=
"Score: "+score;

food=createFood();

}

else{

snake.pop();

}

}



function gameLoop(){

moveSnake();

drawGame();

}



function startGame(){

if(gameStarted)
return;

gameStarted=true;

statusText.innerText=
"Game Started!";

gameInterval=

setInterval(

gameLoop,

180

);

}



navigator.mediaDevices

.getUserMedia({

video:true

})

.then(

stream=>{

video.srcObject=

stream;

}

);




const hands=

new Hands({

locateFile:

file=>

`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`

});



hands.setOptions({

maxNumHands:1,

minDetectionConfidence:0.7,

minTrackingConfidence:0.7

});



hands.onResults(

results=>{

if(

!results.multiHandLandmarks ||

results.multiHandLandmarks.length===0

)

return;



if(!gameStarted)

startGame();



const now=

Date.now();

if(

now-lastGestureTime<250

)

return;

lastGestureTime=now;



const hand=

results.multiHandLandmarks[0];

const x=

hand[9].x;

const y=

hand[9].y;



if(

x<0.3 &&

direction!=="RIGHT"

)

direction="LEFT";


else if(

x>0.7 &&

direction!=="LEFT"

)

direction="RIGHT";


else if(

y<0.3 &&

direction!=="DOWN"

)

direction="UP";


else if(

y>0.7 &&

direction!=="UP"

)

direction="DOWN";



}

);



const camera=

new Camera(

video,

{

onFrame:

async()=>{

await hands.send({

image:video

});

},

width:640,

height:480

}

);


camera.start();
