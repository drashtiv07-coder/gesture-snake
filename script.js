const video =
document.getElementById(
"video"
);

const canvas =
document.getElementById(
"game"
);

const ctx =
canvas.getContext(
"2d"
);

const statusText =
document.getElementById(
"status"
);

const scoreText =
document.getElementById(
"score"
);

const SIZE = 20;

const GRID = 20;

let score = 0;

let direction = "RIGHT";

let snake = [

{x:10,y:10}

];

let food = {

x:15,

y:10

};



function randomFood(){

food={

x:Math.floor(
Math.random()*GRID
),

y:Math.floor(
Math.random()*GRID
)

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



snake.forEach(

(part,index)=>{

ctx.fillStyle=

index===0

?

"yellow"

:

"lime";



ctx.fillRect(

part.x*SIZE,

part.y*SIZE,

SIZE,

SIZE

);

}

);

}



function move(){


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

head.x>=GRID ||

head.y>=GRID ||

snake.some(

s=>

s.x===head.x &&

s.y===head.y

)

)

{

alert(

"Game Over\nScore: "

+score

);

location.reload();

return;

}



snake.unshift(
head
);



if(

head.x===food.x &&

head.y===food.y

)

{

score++;

scoreText.innerText=

"Score: "+score;

randomFood();

}

else{

snake.pop();

}



draw();

}



draw();



setInterval(

move,

180

);





const hands =

new Hands({

locateFile:(file)=>

`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`

});



hands.setOptions({

maxNumHands:1,

modelComplexity:1,

minDetectionConfidence:0.5,

minTrackingConfidence:0.5

});



hands.onResults(

(results)=>{

if(

!results.multiHandLandmarks ||

results.multiHandLandmarks.length===0

){

statusText.innerText=

"Show Hand";

return;

}



statusText.innerText=

"Hand Detected";



const finger=

results

.multiHandLandmarks[0][8];



const x=finger.x;

const y=finger.y;



if(

x<0.35 &&

direction!=="RIGHT"

)

direction="LEFT";



else if(

x>0.65 &&

direction!=="LEFT"

)

direction="RIGHT";



else if(

y<0.35 &&

direction!=="DOWN"

)

direction="UP";



else if(

y>0.65 &&

direction!=="UP"

)

direction="DOWN";



}

);




navigator

.mediaDevices

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

"Camera Denied";

}

);
