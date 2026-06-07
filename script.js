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

const box = 20;

const grid = 20;

let snake = [

{x:10,y:10}

];

let direction = null;

let score = 0;

let food = {

x:5,

y:5

};

let gameStarted=false;



function createFood(){

food={

x:
Math.floor(
Math.random()*grid
),

y:
Math.floor(
Math.random()*grid
)

};

}



function drawGame(){

ctx.fillStyle="black";

ctx.fillRect(

0,

0,

canvas.width,

canvas.height

);



ctx.fillStyle="red";

ctx.fillRect(

food.x*box,

food.y*box,

box,

box

);



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

if(!direction){

drawGame();

return;

}



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

head.x>=grid ||

head.y>=grid ||

snake.some(

part=>

part.x===head.x &&

part.y===head.y

)

)

{

alert(

"Game Over!\nScore: "

+score

);

location.reload();

return;

}



snake.unshift(head);



if(

head.x===food.x &&

head.y===food.y

)

{

score++;

scoreText.innerText=

"Score: "

+score;

createFood();

}

else{

snake.pop();

}



drawGame();

}



setInterval(

moveSnake,

180

);



drawGame();





const hands =
new Hands({

locateFile:

(file)=>

`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`

});



hands.setOptions({

maxNumHands:1,

minDetectionConfidence:0.7,

minTrackingConfidence:0.7

});



hands.onResults(

(results)=>{

if(

!results.multiHandLandmarks ||

results.multiHandLandmarks.length===0

)

return;



if(!gameStarted){

statusText.innerText=

"Hand Detected";

gameStarted=true;

}



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





navigator.mediaDevices

.getUserMedia({

video:true

})

.then(

(stream)=>{

video.srcObject=

stream;



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



}

)

.catch(

()=>{

statusText.innerText=

"Camera Permission Denied";

}

);
