'use strict';

//Setup

//number of circles
var widthOfHalfTone = 5;

//128bpm
var beat = 1000*60/128;//every 468.75ms

//10px half-tone pattern
var maxSize = 10;

//canvas dimensions
var canvasWidth = 640;
var canvasHeight = 360;

//Bpm inputs
var bpmRange = document.getElementById('bpmRange');
var bpmCounter = document.getElementById('bpmCounter');
bpmCounter.value = bpmRange.value;
function changeEventHandler(event)
{
	beat = 1000*60/event.target.value;
	bpmCounter.value = event.target.value;
}
function beatTap()
{
	start = null;
}

//visualisation variables
var TAU = Math.PI * 2;
var start = null;
var canvas = document.getElementById('canvas');
var intermediate = document.getElementById('intermediate');
var videoInput = document.getElementById('videoInput');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var ctx = canvas.getContext('2d');
ctx.fillStyle="#FFFFFF";
var ictx = intermediate.getContext('2d');

function step(timestamp)
{
	//copy video frame data into intermediate canvas
	ictx.drawImage(videoInput, 0, 0, canvasWidth, canvasHeight);
	var currentFrameData = ictx.getImageData(0,0,canvasWidth,canvasHeight).data;

	//setup time for this frame
	if(start === null)
	{
	start = timestamp;
	}
	var progress = timestamp - start;

	//clear the canvas so it's ready to draw on
	ctx.clearRect(0,0,canvasWidth,canvasHeight);

	//draw each circle
	for(var i = 0; i < canvasWidth/(maxSize*2); i++)
	{
		for(var j = 0; j < canvasHeight/(maxSize*2); j++)
		{
			//find out the current circle's colour
			//ctx.fillStyle = 'rgb(200,0,0)';
			ctx.fillStyle = 'rgb('+currentFrameData[0]+','+currentFrameData[1]+','+currentFrameData[2]+')';

			//draw the actual circle
			ctx.beginPath();
			ctx.arc((i*maxSize*2)+maxSize,(j*maxSize*2)+maxSize,progress/beat*maxSize,0,TAU);
			ctx.fill();
			ctx.closePath();
		}
	}


	//is it time to reset the animation?
	if (progress >= beat)
	{
		start = timestamp;
	}

	window.requestAnimationFrame(step);
}

//start animation
window.requestAnimationFrame(step);