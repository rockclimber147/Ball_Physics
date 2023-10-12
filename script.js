var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * .75;

var displaySpeedX = document.getElementById("X_vel");
var displayPositionX = document.getElementById("X_pos");
var displaySpeedY = document.getElementById("Y_vel");
var displayPositionY = document.getElementById("Y_pos");

var ballRadiusSlider = document.getElementById("ballRadiusSlider");
var radiusSpan = document.getElementById("radiusSpan");

var gravitySlider = document.getElementById("gravitySlider");
var gravitySpan = document.getElementById("gravitySpan");

var airResistanceSlider = document.getElementById("airResistanceSlider");
var resistanceSpan = document.getElementById("resistanceSpan");

var dampeningSlider = document.getElementById("dampeningSlider");
var dampeningSpan = document.getElementById("dampeningSpan");

var pullFactorSpan = document.getElementById("pullFactorSpan");
var pullFactorSlider = document.getElementById("pullFactorSlider");

var positionX = 200;
var positionY = 200;
var speedX = 5;
var speedY = 7;

var tailCoords = [];
var tailLength = 60;
var tailHue = 0;
var tailInterpolationAmount = 4;

var ballRadius = 30;
var framesPerSecond = 45;
var acceleration = 1;
var airResistance = 0.995;
var collisionDampening = 0.9;

var mouseIsDown = false;
var mouseX = 0;
var mouseY = 0;
var mousePullFactor = 1.5;

ballRadiusSlider.oninput = function () {
    radiusSpan.innerHTML = this.value;
    ballRadius = parseInt(this.value);
}

gravitySlider.oninput = function () {
    gravitySpan.innerHTML = this.value;
    acceleration = this.value / 100;
}

airResistanceSlider.oninput = function () {
    resistanceSpan.innerHTML = this.value / 2;
    airResistance = 1 - this.value / 200;
}

dampeningSlider.oninput = function () {
    dampeningSpan.innerHTML = this.value;
    collisionDampening = 1 - this.value / 100;
}

pullFactorSlider.oninput = function () {
    pullFactorSpan.innerHTML = this.value / 10;
    mousePullFactor = this.value / 10;
}

function updateMouseCoords(event) {
    let rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}

function simulate() {
    
    if (mouseIsDown){
        applyMouseForce();
    }

    speedY += acceleration;

    speedX *= airResistance;
    speedY *= airResistance;

    positionY += speedY;
    positionX += speedX;

    handleCollisions();

    updateDisplayValues();

    updateTail();

}

function updateDisplayValues(){
    displayPositionX.innerHTML = Math.round(positionX);
    displayPositionY.innerHTML = Math.round(positionY);
    displaySpeedX.innerHTML = Math.round(speedX);
    displaySpeedY.innerHTML = Math.round(speedY);
}

function applyMouseForce(){
    deltaX = mouseX - positionX;
    deltaY = mouseY - positionY;
    distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    speedX += mousePullFactor * deltaX / distance;
    speedY += mousePullFactor * deltaY / distance;
}

function handleCollisions(){
    xCollisionLeft = positionX < ballRadius;
    xCollisionRight = positionX > (canvas.width - ballRadius);

    yCollisionTop = positionY < ballRadius;
    yCollisionBottom = positionY > (canvas.height - ballRadius);

    if (xCollisionLeft || xCollisionRight) {
        speedX *= -1;
        speedX *= collisionDampening;

        if (xCollisionLeft) {
            console.log("Left Collision!")
            positionX = ballRadius + 1;
        } else if (xCollisionRight) {
            console.log("Right Collision!")
            positionX = canvas.width - ballRadius;
        }
    }

    if (yCollisionTop || yCollisionBottom) {
        speedY *= -1;
        speedY *= collisionDampening;

        if (yCollisionTop) {
            console.log("Top Collision!")
            positionY = ballRadius + 1;
        } else if (yCollisionBottom) {
            console.log("Bottom Collision!")
            positionY = canvas.height - ballRadius;
        }
    }
}

function updateTail(){
    // Add coords to end of list
    tailCoords.push([positionX, positionY, tailHue]);
    // Remove from start of list when tail length reached
    if (tailCoords.length >= tailLength){
        tailCoords.shift();
    }
}

function drawTail(){
    for (let i = 0; i < tailCoords.length - 1; i++){
        // draw circles from least recent to most
        tailX = tailCoords[i][0];
        tailY = tailCoords[i][1]
        tailHue = tailCoords[i][2]
        tailAlpha = i / tailLength;

        dTailX = tailCoords[i + 1][0] - tailX;
        dTailY = tailCoords[i + 1][1] - tailY;
        dHue = tailCoords[i + 1][2] - tailHue;
        dTailAlpha = tailAlpha - (i + 1) / tailLength;
        
        tailXStep = dTailX / (1 + tailInterpolationAmount);
        tailYStep = dTailY / (1 + tailInterpolationAmount);
        hueStep = dHue / (1 + tailInterpolationAmount);
        alphaStep = dTailAlpha / (1 + tailInterpolationAmount);
        for (let j = 0; j < 1 + tailInterpolationAmount; j++){
            drawCircle(tailX + j * tailXStep, tailY + j * tailYStep, tailHue + j * hueStep, tailAlpha + j * alphaStep);
        }
    }
}

function drawCircle(x, y, hue, alpha){
    c.beginPath();
    c.arc(x, y, ballRadius, 0, 2 * Math.PI);
    c.fillStyle = "hsl(" + hue + " 100% 50% / " + alpha + ")";
    tailHue += 0.25;
    // tailHue %= 360;
    c.fill();
}

function draw() {
    c.fillStyle = "gray";
    c.fillRect(0, 0, canvas.width, canvas.height);
    drawTail();
    c.beginPath();
    c.lineWidth = "5";
    c.arc(positionX, positionY, ballRadius, 0, 2 * Math.PI);
    c.fillStyle = "white";
    c.stroke();
    if (mouseIsDown) {
        c.moveTo(positionX, positionY);
        c.lineTo(mouseX, mouseY);
        c.stroke();
    }
    c.fill();
    // c.stroke();
}

function tick() {
    simulate();
    draw();
}

setInterval(tick, 1000 / framesPerSecond);
