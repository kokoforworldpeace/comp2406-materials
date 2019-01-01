/*

Javasript to handle mouse dragging and release
to drag a string around the html canvas

Here we are doing all the work with javascript and none of the words
are HTML, or DOM, elements. The only DOM element is just the canvas on which
where are drawing.

*/

//Use javascript array of objects to represent words and their locations
var words = [];
words.push({word: "I", x:50, y:50});
words.push({word: "like", x:70, y:50});
words.push({word: "the", x:120, y:50});
words.push({word: "way", x:170, y:50});
words.push({word: "your", x:230, y:50});
words.push({word: "sparkling", x:300, y:50});
words.push({word: "earrings", x:430, y:50});
words.push({word: "lay", x:530, y:50});



var wordBeingMoved;
var deltaX, deltaY; //location where mouse is pressed
var canvas = document.getElementById('canvas1'); //our drawing canvas

let ctx = canvas.getContext('2d')

//@parameter aCanvasX, aCanvasY
//mousedown locations
function getWordAtLocation(aCanvasX, aCanvasY){

	  //locate the word near aCanvasX,aCanvasY
	  //Just use crude region for now.
	  //should be improved to using lenght of word etc.

	  //note you will have to click near the start of the word
	  //as it is implemented now
	  for(var i=0; i<words.length; i++){
		 if(aCanvasX - words[i].x>0&&aCanvasX - words[i].x<words[i].width) return words[i]
		 // console.log(words[i].word);
	 }
	 	return null;
}

var drawCanvas = function(){

    context = canvas.getContext('2d');

//assign width attributes to words objects
		for (let i = 0;i<words.length;i++) {
			words[i].width = context.measureText(words[i].word).width;
		}

    context.fillStyle = 'white';
    context.fillRect(0,0,canvas.width,canvas.height); //erase canvas

    context.font = '20pt Arial';
    context.fillStyle = 'cornflowerblue';
    context.strokeStyle = 'blue';

    var date = Date().toString();

		//draw text on canvas
    for(var i=0; i<words.length; i++){  //note i declared as var

			var data = words[i];
			context.fillText(data.word, data.x, data.y);
      context.strokeText(data.word, data.x, data.y);
	}

//draw circle on canvas
    context.beginPath();
    context.arc(canvas.width/2, //x co-ord
            canvas.height/2, //y co-ord
			canvas.height/2 - 5, //radius
			0, //start angle
			2*Math.PI //end angle
			);
    context.stroke();
}

//@parameter e
//onmousedown event
var handleMouseDown = function(e){

	//Parameter e: mouse event
	//Exercise: what is the consequence of naming parameter "e" "event" instead.

	//Get mouse location relative to canvas top left
	//Note some browsers support offsetX, offsetY in event which might be
	//easier but this seems to work for all.
	//e.clientX is relative to the window, not our canvas element

//getBoundingClientRect() = context.filRect()
	var rect = canvas.getBoundingClientRect();
    var canvasX = e.clientX - rect.left;
    var canvasY = e.clientY - rect.top;
	//for debug
	console.log("mouse down:" + canvasX + ", " + canvasY);
	// console.log(`e.x : ${e.x}  e.clientX : ${e.clientX}`);
	// console.log("event: " + e);
	// for(key in e) console.log(key + ": " + e[key]);


	wordBeingMoved = getWordAtLocation(canvasX, canvasY);
	if(wordBeingMoved != null ){
	   deltaX = wordBeingMoved.x - canvasX;
	   deltaY = wordBeingMoved.y - canvasY;
	   document.addEventListener("mousemove", handleMouseMove, true);
       document.addEventListener("mouseup", handleMouseUp, true);

	}

// Stop propagation of the event and stop any default
//  browser action

    e.stopPropagation();
    e.preventDefault();

	drawCanvas();
	}

var handleMouseMove = function(e){

	console.log("mouse move");

	//get mouse location relative to canvas top left
	var rect = canvas.getBoundingClientRect();
    var canvasX = e.clientX - rect.left;
    var canvasY = e.clientY - rect.top;

	wordBeingMoved.x = canvasX + deltaX;
	wordBeingMoved.y = canvasY + deltaY;
	e.stopPropagation();
	drawCanvas();
	}

var handleMouseUp = function(e){
	console.log("mouse up");

    document.removeEventListener("mouseup", handleMouseUp, true);
    document.removeEventListener("mousemove", handleMouseMove, true);

	e.stopPropagation();

	drawCanvas();
	}

drawCanvas();
