var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

var ballRadiusSlider = document.getElementById("ballRadiusSlider");
var radiusSpan = document.getElementById("radiusSpan");

ballRadiusSlider.oninput = function () {
    radiusSpan.innerHTML = this.value;
    ballRadius = this.value;
}

var gravitySlider = document.getElementById("gravitySlider");
var gravitySpan = document.getElementById("gravitySpan");

gravitySlider.oninput = function () {
    gravitySpan.innerHTML = this.value;
    acceleration = this.value / 100;
}

var airResistanceSlider = document.getElementById("airResistanceSlider");
var resistanceSpan = document.getElementById("resistanceSpan");

airResistanceSlider.oninput = function () {
    resistanceSpan.innerHTML = this.value / 2;
    airResistance = 1 - this.value / 200;
}

var dampeningSlider = document.getElementById("dampeningSlider");
var dampeningSpan = document.getElementById("dampeningSpan");

dampeningSlider.oninput = function () {
    dampeningSpan.innerHTML = this.value;
    collisionDampening = 1 - this.value / 100;
}

var positionX = 200;
var positionY = 200;
var speedX = 5;
var speedY = 7;

var ballRadius = 30;
var framesPerSecond = 60;
var acceleration = 1;
var airResistance = 0.995;
var collisionDampening = 0.9;

var mouseIsDown = false;
var mouseX = 0;
var mouseY = 0;

function updateMouseCoords(event){
    let rect = canvas.getBoundingClientRect(); 
    mouseX = event.clientX - rect.left; 
    mouseY = event.clientY - rect.top; 
}


canvas.width = window.innerWidth;
canvas.height = window.innerHeight * .9;

let canvasElem = document.querySelector("canvas");


function simulate() {
    xCollisionLeft = positionX <= ballRadius;
    xCollisionRight = positionX >= (canvas.width - ballRadius);

    yCollisionTop = positionY <= ballRadius;
    yCollisionBottom = positionY >= (canvas.height - ballRadius);

    if (xCollisionLeft || xCollisionRight) {
        speedX *= -1;
        speedX *= collisionDampening;

        console.log("X: " + positionX + "Y: " + positionY);

        if (xCollisionLeft){
            console.log("HELLO");
            positionX = ballRadius;
        } else if (xCollisionRight){
            positionX = canvas.width - ballRadius;
        }
    }

    if (yCollisionTop || yCollisionBottom) {
        speedY *= -1;
        speedY *= collisionDampening;

        if (yCollisionTop){
            positionY = ballRadius;
        } else if (yCollisionBottom){
            positionY = canvas.height - ballRadius;
        }
    }
    positionX += speedX;
    speedY += acceleration;
    positionY += speedY;

    if (mouseIsDown){
        deltaX = mouseX - positionX;
        deltaY = mouseY - positionY;
        distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        speedX += deltaX / distance;
        speedY += deltaY / distance;
    }

    speedX *= airResistance;
    speedY *= airResistance;
    positionX = Math.round(positionX);
    positionY = Math.round(positionY);
    console.log("Left: " + xCollisionLeft + " Right: " + xCollisionRight)
}

function draw() {
    c.beginPath();
    c.lineWidth = "5";
    c.arc(positionX, positionY, ballRadius, 0, 2 * Math.PI);
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.stroke();
    if (mouseIsDown){
        c.moveTo(positionX,positionY);
        c.lineTo(mouseX,mouseY);
        c.stroke();
    }
}

function tick() {
    simulate();
    draw();
}

setInterval(tick, 1000 / framesPerSecond);
