/*
Javasript to handle mouse dragging and release
to drag a string around the html canvas
Keyboard arrow keys are used to move a moving box around

Here we are doing all the work with javascript and jQuery. (none of the words
are HTML, or DOM, elements. The only DOM element is just the canvas on which
where are drawing and a text field and button where the user can type data

This example shows examples of using JQuery
See the W3 Schools website to learn basic JQuery
JQuery syntax:
$(selector).action();
e.g.
$(this).hide() - hides the current element.
$("p").hide() - hides all <p> elements.
$(".test").hide() - hides all elements with class="test".
$("#test").hide() - hides the element with id="test".

Mouse event handlers are being added and removed using jQuery and
a jQuery event object is being passed to the handlers

Keyboard keyDown handler is being used to move a "moving box" around
Keyboard keyUP handler is used to trigger communication with the
server via POST message sending JSON data

*/

//Use javascript array of objects to represent words and their locations
let words = []
words.push({word: "I", x: 50, y: 50})
words.push({word: "like", x: 70, y: 50})
words.push({word: "the", x: 120, y: 50})
words.push({word: "way", x: 170, y: 50})
words.push({word: "your", x: 230, y: 50})
words.push({word: "sparkling", x: 300, y: 50})
words.push({word: "earrings", x: 430, y: 50})
words.push({word: "lay", x: 540,y: 50})

let movingString = {
  word: "Moving",
  x: 100,
  y: 100,
  xDirection: 1, //+1 for leftwards, -1 for rightwards
  yDirection: 1, //+1 for downwards, -1 for upwards
  stringWidth: 50, //will be updated when drawn
  stringHeight: 24
} //assumed height based on drawing point size

//indended for keyboard control
let movingBox = {
  x: 50,
  y: 50,
  width: 100,
  height: 100
}

let wayPoints = [] //locations where the moving box has been

let timer

let wordBeingMoved

let deltaX, deltaY //location where mouse is pressed
const canvas = document.getElementById('canvas1') //our drawing canvas

let title='dafault'




function getWordAtLocation(aCanvasX, aCanvasY) {

  //locate the word near aCanvasX,aCanvasY
  //Just use crude region for now.
  //should be improved to using lenght of word etc.

  //note you will have to click near the start of the word
  //as it is implemented now
  for (let i = 0; i < words.length; i++) {
    if (Math.abs(words[i].x - aCanvasX) < 20 &&
      Math.abs(words[i].y - aCanvasY) < 20) return words[i];
  }
  return null
}

function drawCanvas() {

  const context = canvas.getContext('2d')

  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  context.font = '20pt Arial'
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'

  for (let i = 0; i < words.length; i++) { //note i declared as var

    let data = words[i]
    context.fillText(data.word, data.x, data.y)
    context.strokeText(data.word, data.x, data.y)

  }

  movingString.stringWidth = context.measureText(movingString.word).width;
  //console.log(movingString.stringWidth);
  context.fillText(movingString.word, movingString.x, movingString.y);

  //draw moving box
  context.fillRect(movingBox.x,
    movingBox.y,
    movingBox.width,
    movingBox.height)

  //draw moving box way points
  for (let i in wayPoints) {
    context.strokeRect(wayPoints[i].x,
      wayPoints[i].y,
      movingBox.width,
      movingBox.height)
  }
  //draw circle
  context.beginPath();
  context.arc(canvas.width / 2, //x co-ord
    canvas.height / 2, //y co-ord
    canvas.height / 2 - 5, //radius
    0, //start angle
    2 * Math.PI //end angle
  );
  context.stroke()
}

function handleMouseDown(e) {

  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  //var canvasX = e.clientX - rect.left;
  //var canvasY = e.clientY - rect.top;
  let canvasX = e.pageX - rect.left //use jQuery event object pageX and pageY
  let canvasY = e.pageY - rect.top
  console.log("mouse down:" + canvasX + ", " + canvasY)

  wordBeingMoved = getWordAtLocation(canvasX, canvasY)
  //console.log(wordBeingMoved.word);
  if (wordBeingMoved != null) {
    deltaX = wordBeingMoved.x - canvasX;
    deltaY = wordBeingMoved.y - canvasY;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    // f("#canvas1").mousemove(handleMouseMove)
    // f("#canvas1").mouseup(handleMouseUp)

  }

  // Stop propagation of the event and stop any default
  //  browser action

  e.stopPropagation()
  e.preventDefault()

  drawCanvas()
}

function handleMouseMove(e) {

  console.log("mouse move")

  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  let canvasX = e.pageX - rect.left
  let canvasY = e.pageY - rect.top

  wordBeingMoved.x = canvasX + deltaX
  wordBeingMoved.y = canvasY + deltaY

  e.stopPropagation()

  drawCanvas()
}

function handleMouseUp(e) {
  console.log("mouse up")

  e.stopPropagation();
  e.preventDefault()

  //$("#canvas1").off(); //remove all event handlers from canvas
  //$("#canvas1").mousedown(handleMouseDown); //add mouse down handler

  //remove mouse move and mouse up handlers but leave mouse down handler
  // document.getElementById('canvas1').removeEventListener("mousemove", handleMouseMove);
  // document.getElementById('canvas1').removeEventListener("mouseup", handleMouseUp);




  $("#canvas1").off("mousemove", handleMouseMove) //remove mouse move handler
  $("#canvas1").off("mouseup", handleMouseUp); //remove mouse up handler

  drawCanvas(); //redraw the canvas
}

//JQuery Ready function -called when HTML has been parsed and DOM
//created
//can also be just $(function(){...});
//much JQuery code will go in here because the DOM will have been loaded by the time
//this runs

function handleTimer() {
  movingString.x = (movingString.x + 5 * movingString.xDirection)
  movingString.y = (movingString.y + 5 * movingString.yDirection)

  //keep inbounds of canvas
  if (movingString.x + movingString.stringWidth > canvas.width) movingString.xDirection = -1
  if (movingString.x < 0) movingString.xDirection = 1
  if (movingString.y > canvas.height) movingString.yDirection = -1
  if (movingString.y - movingString.stringHeight < 0) movingString.yDirection = 1

  drawCanvas()
}

//KEY CODES
//should clean up these hard coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40


function handleKeyDown(e) {

  console.log("keydown code = " + e.which)

  var dXY = 5; //amount to move in both X and Y direction
  if (e.which == UP_ARROW && movingBox.y >= dXY)
    movingBox.y -= dXY //up arrow
  if (e.which == RIGHT_ARROW && movingBox.x + movingBox.width + dXY <= canvas.width)
    movingBox.x += dXY //right arrow
  if (e.which == LEFT_ARROW && movingBox.x >= dXY)
    movingBox.x -= dXY //left arrow
  if (e.which == DOWN_ARROW && movingBox.y + movingBox.height + dXY <= canvas.height)
    movingBox.y += dXY //down arrow

  let keyCode = e.which;
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }

}

function handleKeyUp(e) {
  console.log("key UP: " + e.which)
  if (e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW) {
    let dataObj = {
      x: movingBox.x,
      y: movingBox.y
    }
    //create a JSON string representation of the data object
    let jsonString = JSON.stringify(dataObj)


    fetch('http://localhost:3000/example1.html/positionData',{
      method : 'POST',
      body : jsonString
    }).then(resp => {return resp.json()})
    .then(function(data) {
      console.log("data: " + data)
        console.log("typeof: " + typeof data)
        //var wayPoint = JSON.parse(data); //<--use this if expecting 'text/plain'
        let wayPoint = data //<--use this if expecting 'application/json'
        wayPoints.push(wayPoint)
        for (let i in wayPoints) console.log(wayPoints[i])
    })


    // $.post("positionData", jsonString, function(data, status) {
    //   console.log("data: " + data)
    //   console.log("typeof: " + typeof data)
    //   //var wayPoint = JSON.parse(data); //<--use this if expecting 'text/plain'
    //   let wayPoint = data //<--use this if expecting 'application/json'
    //   wayPoints.push(wayPoint)
    //   for (let i in wayPoints) console.log(wayPoints[i])
    // })
  }

  if (e.which == ENTER) {
    handleSubmitButton() //treat ENTER key like you would a submit
    document.getElementById('userTextField').value = ''
    // f('#userTextField').val('') //clear the user text field
  }

  e.stopPropagation()
  e.preventDefault()
}

function handleSubmitButton() {

  let userText =   document.getElementById('userTextField').value //get text from user text input field
  if (userText && userText != '') {
    let userRequestObj = {
      text: userText
    }
    let userRequestJSON = JSON.stringify(userRequestObj)
    document.getElementById('userTextField').value = ''

    // f('#userTextField').val('') //clear the user text field

    //alert ("You typed: " + userText);



   fetch('http://localhost:3000/example1.html/xxx', {
  method: 'POST', // request method
  body: userRequestJSON // resquest json string

}).then(function(response) {
    return response.json();  //resp.jason()  return resp object
  })
  .then(function(data) {
    console.log("data: " + data)
    console.log("typeof: " + typeof data)
    //var responseObj = JSON.parse(data); //<-- use this if expecting 'text/plain'
    let responseObj = data //<-- use this if expecting 'application/json'
    movingString.word = responseObj.text
    if (responseObj.wordArray) {
      words = responseObj.wordArray
      title = responseObj.title
    }
  })

    // $.post("userText", userRequestJSON, function(data, status) {
    //   console.log("data: " + data)
    //   console.log("typeof: " + typeof data)
    //   //var responseObj = JSON.parse(data); //<-- use this if expecting 'text/plain'
    //   let responseObj = data //<-- use this if expecting 'application/json'
    //   movingString.word = responseObj.text
    //   if (responseObj.wordArray) words = responseObj.wordArray
    // })
  }
}

function handleSave() {
  let sendObj = {}
  sendObj.wordArray = words
  sendObj.text = 'saveFile'
  sendObj.title = title
  let ModifiedWords = JSON.stringify(sendObj)
  fetch('http://localhost:3000/example1.html/ModifiedWords',{
    method : 'POST',
    body : ModifiedWords
  }).then(resp => {
    return resp.json()
  }).then(data =>{
    console.log(`file has been saved : ${data.saved}`);
  })
}

document.addEventListener('DOMContentLoaded',function(){
  //This is called after the broswer has loaded the web page

  //add mouse down listener to our canvas object
  document.getElementById("canvas1").addEventListener('mousedown',handleMouseDown)
  // f("#canvas1").mousedown(handleMouseDown)

  //add key handler for the document as a whole, not separate elements.
  document.addEventListener('keydown',handleKeyDown)
  document.addEventListener('keyup',handleKeyUp)

  timer = setInterval(handleTimer, 100)
  //timer.clearInterval(); //to stop

  drawCanvas()
})
