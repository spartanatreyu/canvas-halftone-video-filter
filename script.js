'use strict';

//Setup

//number of circles
var widthOfHalfTone = 5;

//90bpm
var beat = 1000*60/140;//666.66

//10px half-tone pattern
var maxSize = 3;



//Bpm inputs
var bpmRange = document.getElementById('bpmRange');
var bpmCounter = document.getElementById('bpmCounter');
bpmCounter.value = (1000 * 60 / beat);
bpmRange.value = (1000 * 60 / beat);
function changeBpmHandler(event)
{
	beat = 1000*60/event.target.value;
	bpmRange.value = event.target.value;
	bpmCounter.value = event.target.value;
}
function beatTap()
{
	start = null;
}

//halftone inputs
var halftoneRange = document.getElementById('halftoneRange');
var halftoneCounter = document.getElementById('halftoneCounter');
halftoneCounter.value = maxSize;
halftoneRange.value = maxSize;
function changeHalftoneHandler(event)
{
	maxSize = event.target.value;
	halftoneRange.value = event.target.value;
	halftoneCounter.value = event.target.value;
}

var message = document.getElementById('message');

//visualisation variables
var TAU = Math.PI * 2;
var start = null;
var canvas = document.getElementById('canvas');
var intermediate = document.getElementById('intermediate');
var videoInput = document.getElementById('videoInput');
var canvasWidth = 640;
var canvasHeight = 360;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
//ctx = context, ictx = intermediate context
var ctx = canvas.getContext('2d');
var ictx = intermediate.getContext('2d');
var currentFrameData = undefined;


function step(timestamp)
{
	//copy video frame data into intermediate canvas
	ictx.drawImage(videoInput, 0, 0, canvasWidth, canvasHeight);
	currentFrameData = ictx.getImageData(0,0,canvasWidth,canvasHeight).data;

	//setup time for this frame
	if(start === null)
	{
	start = timestamp;
	}
	var progress = timestamp - start;

	//clear the canvas so it's ready to draw on
	ctx.clearRect(0,0,canvasWidth,canvasHeight);

	
	var maxI = 0;
	var maxJ = 0;

	//j is not calculated right, drawing 18 more circles

	//draw each circle
	for(var i = 0; i < canvasWidth/(maxSize*2); i++)
	{
		for(var j = 0; j < canvasHeight/(maxSize*2); j++)
		{
			ctx.fillStyle = 'rgb('+
				currentFrameData[((canvasWidth * j) * 4 * (maxSize*2)) + (i * 4 * maxSize * 2) + 0]+','+
				currentFrameData[((canvasWidth * j) * 4 * (maxSize*2)) + (i * 4 * maxSize * 2) + 1]+','+
				currentFrameData[((canvasWidth * j) * 4 * (maxSize*2)) + (i * 4 * maxSize * 2) + 2]+')';

			//draw the actual circle
			ctx.beginPath();
			ctx.arc((i*maxSize*2)+maxSize,(j*maxSize*2)+maxSize,progress/beat*maxSize,0,TAU);
			ctx.fill();
			ctx.closePath();

			maxJ++;
		}
		maxI++;
	}

	message.innerHTML = 'maxSize = '+maxSize+', maxI = '+maxI+', maxJ = '+maxJ;


	//is it time to reset the animation?
	if (progress >= beat)
	{
		start = timestamp;
	}

	window.requestAnimationFrame(step);
}

//start animation
window.requestAnimationFrame(step);