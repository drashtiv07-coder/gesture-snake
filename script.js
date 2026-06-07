const video=document.getElementById("video");

const canvas=document.getElementById("game");

const ctx=canvas.getContext("2d");

const status=document.getElementById("status");

const scoreText=document.getElementById("score");

const SIZE=20;

const GRID=20;

let score=0;

let direction="RIGHT";

let snake=[{x:10,y:10}];

let food={x:15,y:10};



function newFood(){

food={

x:Math.floor(Math.random()*GRID),

y:Math.floor(Math.random()*GRID)

};

}



function draw(){

ctx.fillStyle="black";

ctx.fillRect(

0,
0,

canvas.width,

canvas.height

);



ctx.fillStyle="red";

ctx.fillRect(

food.x*SIZE,

food.y*SIZE,

SIZE,

SIZE

);



snake.forEach((s,i)=>{

ctx.fillStyle=

i==0

?

"yellow"

:

"lime";

ctx.fillRect(

s.x*SIZE,

s.y*SIZE,

SIZE,

SIZE

);

});

}



function move(){

let head={...snake[0]};



if(direction==="LEFT")
head.x--;

if(direction==="RIGHT")
head.x++;

if(direction==="UP")
head.y--;

if(direction==="DOWN")
head.y++;



if(

head.x<0||

head.y<0||

head.x>=GRID||

head.y>=GRID||

snake.some(

s=>

s.x===head.x &&

s.y===head.y

)

){

alert("Game Over");

location.reload();

return;

}



snake.unshift(head);



if(

head.x===food.x&&

head.y===food.y

){

score++;

scoreText.innerText=

"Score: "+score;

newFood();

}

else{

snake.pop();

}



draw();

}



setInterval(

move,

180

);



draw();





const hands=

new Hands({

locateFile:(file)=>

`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`

});



hands.setOptions({

maxNumHands:1,

modelComplexity:0,

minDetectionConfidence:0.4,

minTrackingConfidence:0.4

});



hands.onResults(

(results)=>{

if(

!results.multiHandLandmarks ||

results.multiHandLandmarks.length===0

){

status.innerText=

"No Hand";

return;

}



status.innerText=

"Hand Detected";



const hand=

results.multiHandLandmarks[0];



let centerX=0;

let centerY=0;



for(

let point of hand

){

centerX+=point.x;

centerY+=point.y;

}



centerX/=21;

centerY/=21;



if(

centerX<0.4 &&

direction!=="LEFT"

)

direction="RIGHT";



else if(

centerX>0.6 &&

direction!=="RIGHT"

)

direction="LEFT";



else if(

centerY<0.4 &&

direction!=="DOWN"

)

direction="UP";



else if(

centerY>0.6 &&

direction!=="UP"

)

direction="DOWN";



}

);





navigator.mediaDevices

.getUserMedia({

video:true

})

.then(stream=>{

video.srcObject=stream;



const camera=

new Camera(

video,

{

onFrame:async()=>{

await hands.send({

image:video

});

},

width:640,

height:480

}

);



camera.start();

});
