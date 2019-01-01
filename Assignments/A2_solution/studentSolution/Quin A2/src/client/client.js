// This is what the client gets for being so nice to the server.


// Based on code from tutorial 2.

// Uh, so, I used "Beautify" to format indentation and lines, and, uh,
// it made alot more lines than necessary :'(



// Global variables:
let timer //use for animation motion
let wordBeingMoved
let deltaX, deltaY //location where mouse is pressed
var initialDraw = true; // Whether to reposition everything or not
const canvas = document.getElementById('canvas1'); //our drawing canvas
var defaultFontSize = 40; // Bogus depending on which browser you use.
var fontSize = 15; // Also bogus
var fontName = "Consolas"; // Somehow not bogus.
var fresh = true; // Whether a save can be done
var bottomLyrics = "Nothing is loaded yet!"; // Lyrics displayed at the bottom


let cTranspo_regex = [];
// put the below into it's own block so that it may be folded [-] in editors
// which have such functionality; alot less ugly to look at when it's
// reduced to {...}.
{
  cTranspo_regex.push({
    chord: "A",
    regex1: "A[^#]",
    regex2: "A[^#]"
  });
  cTranspo_regex.push({
    chord: "A#",
    regex1: "A#",
    regex2: "Bb"
  });
  cTranspo_regex.push({
    chord: "B",
    regex1: "B",
    regex2: "B"
  });
  cTranspo_regex.push({
    chord: "C",
    regex1: "C[^#]",
    regex2: "C[^#]"
  });
  cTranspo_regex.push({
    chord: "C#",
    regex1: "C#",
    regex2: "Db"
  });
  cTranspo_regex.push({
    chord: "D",
    regex1: "D[^#]",
    regex2: "D[^#]"
  });
  cTranspo_regex.push({
    chord: "D#",
    regex1: "D#",
    regex2: "Eb"
  });
  cTranspo_regex.push({
    chord: "E",
    regex1: "E",
    regex2: "E"
  });
  cTranspo_regex.push({
    chord: "F",
    regex1: "F[^#]",
    regex2: "F[^#]"
  });
  cTranspo_regex.push({
    chord: "F#",
    regex1: "F#",
    regex2: "Gb"
  });
  cTranspo_regex.push({
    chord: "G",
    regex1: "G[^#]",
    regex2: "G[^#]"
  });
  cTranspo_regex.push({
    chord: "G#",
    regex1: "G#",
    regex2: "Ab"
  });
}
//Use javascript array of objects to represent words and their locations:
let words = []
{
   words.push({
    text: "Nothing",
    x: 0,
    y: 0
  });
  words.push({
    text: "is",
    x: 0,
    y: 0
  });
  words.push({
    text: "loaded",
    x: 0,
    y: 0
  });
  words.push({
    text: "yet!",
    x: 0,
    y: 0
  });
}

function getWordAtLocation(aCanvasX, aCanvasY) {
  //locate the word near aCanvasX,aCanvasY
  //Just use crude region for now.
  //should be improved to using lenght of word etc.

  //note you will have to click near the start of the word
  //as it is implemented now
  let context = canvas.getContext('2d') // Get the context for the canvas
  // This loops over all of the words in, well, words.
  // Once it has arrived at the index of the word closest to the click
  // (as determined in the if statement within the loop); it will return
  // word (if the if statement evaluates to true).

  // User is dragging something; canvas no longer fresh!
  fresh = false;
  document.getElementById('saveas').style.background = 'red';
  document.getElementById('refresh').style.background = 'green';
  document.getElementById('refresh').value = "Refresh (REQUIRED FOR SAVE)";

  for (let i = 0; i < words.length; i++) {
    if (Math.abs(words[i].x - aCanvasX +
        (context.measureText(words[i].text).width) / 2) <
      (context.measureText(words[i].text).width) / 2 &&
      Math.abs(words[i].y - aCanvasY - (context.measureText("m").width) / 2) < (context.measureText("m.").width) / 2) {
      return words[i]
    }
  }
  return null
}

// Save and refresh related functions:
{
  // Thorws Old Spice (TM) at the canvas until it submits to the new world order.
  function refresh() {
    saveAs(false); // Why re-write code?
    fresh = true; // Spik-and-span
    document.getElementById('saveas').style.background = 'green';
    document.getElementById('refresh').style.background = 'white';
    document.getElementById('refresh').value = "Refresh";
  }
  // Saves the current order of the words into a new song
  function saveAs(reallySave = true) {
    let fileName = document.getElementById('userTextField').value
    if (!fresh && reallySave) {
      alert("Refresh required before save can occur!");
      return;
    }
    if (fileName == "" && reallySave) {
      alert("You must submit a name for the new file!");
      return;
    }
    document.getElementById('userTextField').value = ""; // Make it blank again!
    let context = canvas.getContext('2d') // Defines which context is used  
    // Loop over all of the words, use their x location to determine
    // it's position in a line, and it's y locaiton to determine it's line.

    // First, sort all of the words into newLyrics, then convert it to text.
    let lines = [];

    // Get the number of distinct y values (# lines);
    for (let i = 0; i < words.length; i++) {
      if (!(lines.includes(words[i].y))) {
        if (!(words[i].isChord)) { // if it's a chord, don't consider it.
          let m = context.measureText("m").width;
          let shouldPush = true; // Whether or not a word should be added
          for (let j = 0; j < lines.length; j++) {
            if ((lines[j] - m) < words[i].y && words[i].y < (lines[j] + m)) {
              shouldPush = false;
              // Debugging:
              words[i].y = lines[j];
              break;
            }
          }
          if (shouldPush)
            lines.push(words[i].y);
        } else {
          // ...These arent a c t u a l l y on their own line...
          // ...these are just ABOVE the line they belong to....
          // ...Fix this by... uh....... Shifting them down (+=down)?
          let m = context.measureText("m").width;
          let shouldPush = true;
          for (let j = 0; j < lines.length; j++) {
            if ((lines[j] - m) < words[i].y + context.measureText("||||").width &&
              words[i].y < (lines[j] + m)) {
              shouldPush = false;
              // Debugging:
              words[i].y = lines[j];
              break;
            }
          }
          if (shouldPush)
            lines.push(words[i].y);
        }
      }
    }
    // Sort lines (so that the original first line word isn't registered as
    // being on the first line!)
    lines.sort(function (a, b) {
      return a - b;
    });

    // Loop over the 'lines', sort all of the words that are on the line
    // based on their x value.
    let last_y = 0;
    let orderedLines = [];

    for (let i = 0; i < lines.length; i++) {
      let curLine = [];
      for (let j = 0; j < words.length; j++) {
        if (words[j].y == lines[i]) {
          if (words[j].text == "<br>") continue;
          if (words[j].isChord) {
            curLine.push({
              text: "[" + words[j].text + "]", // Actual text
              isChord: words[j].isChord, // Whether the word is a chord
              x: words[j].x, // For later sorting
              isSpecial: words[j].isSpecial // Whether this is punctuation
            });
            continue;
          }
          let wordWithoutEndLine = "";
          for (var c in words[j].text) {
            if (words[j].text[c] == '\n') {
              wordWithoutEndLine += "";
            } else {
              wordWithoutEndLine += words[j].text[c];
            }
          }
          curLine.push({
            text: wordWithoutEndLine, // Actual text
            isChord: words[j].isChord, // Whether the word is a chord
            x: words[j].x, // For later sorting
            isSpecial: words[j].isSpecial // Whether this is punctuation
          });
        }
      }
      // Sort curLine:
      curLine.sort(function (a, b) {
        return a.x - b.x;
      });

      orderedLines.push(curLine);
      curLine = [];
    }
    // And now, parse orderedLines into text:
    let newLyrics = "";
    for (let l in orderedLines) { // Iterate over the lines
      for (let w in orderedLines[l]) { // Iterate over the words
        let addSpace = true;
        if (orderedLines[l][w].isSpecial) {
          addSpace = false;
        }
        newLyrics += orderedLines[l][w].text;
        if (addSpace) newLyrics += " ";
      }
      if (l < orderedLines.length - 1)
        newLyrics += "\n";
    }
    // Parse the lyrics into html friendly text for the bottom-text:
    var lyrics_html = ""; // Lyrics formatted for HTML
    for (var c in newLyrics) {
      if (newLyrics.charAt(c) == '\n') {
        lyrics_html += "<br>";
      } else {
        lyrics_html += newLyrics.charAt(c);
      }
    }
    
    bottomLyrics = lyrics_html;
    let textDiv = document.getElementById("text-area");
    textDiv.innerHTML = '<p>' + bottomLyrics + '</p>';

    // Send the new lyrics to the server and have it parse and send it
    // back as the new words! (because I'm lazy):
    // Send the lyrics:
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'newSong');
    xhr.onload = () => {
      let responseObj = JSON.parse(xhr.responseText);
      if (responseObj.allClear) {
        words = responseObj.words;
        initialDraw = true;
        drawCanvas();
      }
    }
    data = JSON.stringify({
      title: fileName,
      text: newLyrics,
      saveMe: reallySave
    });
    xhr.send(data);
    initialDraw = true;
    drawCanvas();
  }
}

// Displays inistructional information
function help() {
  alert(
    "Help Dialog:\n" +
    "To request a song, type the name into the text field, then click " +
    "'Submit Request' or hit the enter key.\n\n" +
    "To transpose the displayed chords, click the Transpose Up or Transpose " +
    "Down buttons; the left and right arrow keys also work, up and down " +
    "respectivly\n\n" +
    "The 'Reload Last Song' button does as it implies, and load the last " +
    "requested song.\n\n" +
    "The 'Save As' button will save the current song if a name is given in " +
    "the textfield, and the canvas has been refreshed.\n\n" +
    "The 'Refresh' button refreshes the canvas, aligning words while maintaining " +
    "the order they were left in if dragged; new lines will be inserted accordingly."
  );
}

// Draws the canvas:
function drawCanvas() {
  let context = canvas.getContext('2d') // Defines which context is used

  context.fillStyle = '#e5e0ce'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  context.font = fontSize + "pt " + fontName; // Font to use
  context.fillStyle = 'black' // Colour of the text
  context.strokeStyle = 'black' // Colour of the text outline
  var yMultiplier = context.measureText("mmmm").width; // vertical multiplier
  // If initialDraw is true, then all of the words and chords are positioned
  // in the normal way; this is also called from the repositioning button,
  // which sets the above 'flag' to true.
  if (initialDraw) {
    fontSize = defaultFontSize; // Font size to use (initially)
    context.font = fontSize + "pt " + fontName; // Font to use
    var done = false; // Whether the lyrics font is done being resized
    var resize = false; // Whether a resize operation is occuring
    while (!done) {
      var line = 2; // Which line words[i] should be on (vertical offset for intial text)
      // vertical offset multiplier; 
      var yMultiplier = context.measureText("mm||").width;
      var lineLength = 30; // Padding of 30px on the left of a line
      // Loop over all of the words:
      for (let i = 0; i < words.length; i++) {
        // If a resize operation has been triggered, flip the resize flag:
        if (resize) resize = false;
        let data = words[i]
        if (data.text == "<br>") {
          // Threw these in here to identify when the line should be ended.
          lineLength = 30; // New line: pixel offset is now 10, to pad on the left.
          line += 1; // Increment the line (vertical offset)
          words[i].y = line * yMultiplier;
          words[i].isSpecial = true;
          continue; // Stops the <br> from being drawn.
        }
        // Subtracting 120 from below becaue values under this resulted in characters
        // being drawn off the side without bias for the font resize.
        if (lineLength >= canvas.width - 120) {
          /* 
          OH NO! We don't want to do this, because odds are that
          there will be a <br> word soon that'll make this whole thing look dumb!
          Handle this by RESTARTING with a smaller font size
          */
          fontSize--; // Reduce the fond
          context.font = fontSize + "pt " + fontName; // Define the font
          resize = true; // Tell the loop that a resize is occuring
          break;
        } else {

          if (data.isChord) { // handle special case
            words[i].y = line * yMultiplier - context.measureText("||||").width;
            words[i].x = lineLength + context.measureText(data.xOffSet).width;
            if (!data.inWord) {
              lineLength += (context.measureText(data.text).width);
              lineLength += (context.measureText("  ").width);
            }
          } else {
            words[i].y = line * yMultiplier;
            words[i].x = lineLength;
            lineLength += (context.measureText(data.text).width);
            if (!data.special)
              lineLength += (context.measureText("  ").width);
          }
        }
      }
      if (resize) {
        resize = false;
        continue;
      }
      done = true;
    }
  }
  // Re-alignment of words not required on this draw:
  if (!initialDraw) {
    let dw = "";
    for (let i = 0; i < words.length; i++) {
      let data = words[i];
      // Color chords green:
      if (data.isChord) {
        context.fillStyle = 'green'; // Set the context fillStyle to green
        // Dirty method of removing the brackets:
        for (let j in data.text)
          if (data.text[j] != "[" && data.text[j] != "]")
            dw += data.text[j];

        context.fillText(dw, data.x, data.y);
        dw = "";
        context.fillStyle = 'black'; // Set the context fillStyle to black (normal)
      } else {
        // Draw it normally (not a chord)
        // Check to see if it's the <br> word:
        if (data.text == "<br>") {
          continue; // Stops the <br> from being drawn.
        }
        context.fillText(data.text, data.x, data.y);
      }
    }
  } else {
    // Toggle the globa variable as to not re-align each draw phase
    initialDraw = false;
  }
  context.stroke()
}

// Handles left mouse button down event:
function handleMouseDown(e) {
  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  //var canvasX = e.clientX - rect.left
  //var canvasY = e.clientY - rect.top
  let canvasX = e.pageX - rect.left //use jQuery event object pageX and pageY
  let canvasY = e.pageY - rect.top
  console.log("mouse down:" + canvasX + ", " + canvasY)

  wordBeingMoved = getWordAtLocation(canvasX, canvasY)
  //console.log(wordBeingMoved.word)
  if (wordBeingMoved != null) {
    deltaX = wordBeingMoved.x - canvasX
    deltaY = wordBeingMoved.y - canvasY
    //document.addEventListener("mousemove", handleMouseMove, true)
    //document.addEventListener("mouseup", handleMouseUp, true)
    document.getElementById("canvas1").addEventListener('mousemove', handleMouseMove);
    document.getElementById("canvas1").addEventListener('mouseup', handleMouseUp);

  }

  // Stop propagation of the event // TODO:  stop any default
  // browser behaviour

  e.stopPropagation()
  e.preventDefault()

  drawCanvas()
}

// Handles movemen of the mouse, specifically when the left-mouse-button is down
function handleMouseMove(e) {
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

  e.stopPropagation()

  document.getElementById("canvas1").removeEventListener('mousemove', handleMouseMove);
  document.getElementById("canvas1").removeEventListener('mouseup', handleMouseUp);

  drawCanvas() //redraw the canvas
}

// Redraw the canvas each time interval
function handleTimer() {
  drawCanvas()
}

//KEY CODES
//should clean up these hard coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40

// Handles user keypress for the down arrow:
function handleKeyDown(e) {
  console.log("keydown code = " + e.which)
}

// Handles user keypress for the up arrow:
function handleKeyUp(e) {
  console.log("key UP: " + e.which)
  if (e.which == ENTER) {
    handleSubmitButton() //treat ENTER key like you would a submit
    // $('#userTextField').val('') //clear the user text field
    document.getElementById('userTextField').value = "";
  }
  // These also scrolled, so left and right are probably better
  // else if (e.which == UP_ARROW){
  //   handleTransposeUpButton();
  // }
  // else if (e.which == DOWN_ARROW){
  //   handleTransposeDownButton();
  // }
  else if (e.which == RIGHT_ARROW) {
    handleTransposeUpButton();
  } else if (e.which == LEFT_ARROW) {
    handleTransposeDownButton();
  }
}

// Handles pressing of allign button:
function handleAlignButton() {
  document.getElementById('saveas').style.background = 'green';
  document.getElementById('refresh').style.background = 'white';
  document.getElementById('refresh').value = "Refresh";
  fresh = true;
  handleSubmitButton(true);
  initialDraw = true;
  drawCanvas();
}

// Handles pressing of the submit button; now takes fromReset flag
// to determine whether it needs to grab text from the text-field or if
// reset is asking for a reload of the last requested song.
function handleSubmitButton(fromReset = false) {
  let userText = "";
  if (!fromReset)
    userText = document.getElementById('userTextField').value; //get text from user text input field
  else {
    userText = loadedSong;
  }
  if (userText && userText != '') {
    //user text was not empty
    let userRequestObj = {
      text: userText
    }; //make object to send to server
    let userRequestJSON = JSON.stringify(userRequestObj); //make JSON string
    document.getElementById('userTextField').value = ""; //clear the user text field
    //Prepare a POST message for the server and a call back function
    //to catch the server repsonse.
    $.post("userText", userRequestJSON, function (data, status) {
      console.log("data: " + data);
      console.log("typeof: " + typeof data);
      let responseObj = JSON.parse(data);
      //replace word array with new words if there are any
      if (responseObj.found == true) {
        words = responseObj.lyrics;
        loadedSong = userText;
        //---------------------------------------------------------
        // Print the requested song title in HTML below everything
        // Iterate over the lyrics and add the specified \n (<br>)
        var lyrics_old = responseObj.lyrics; // Original lyrics
        var bottomLyrics = ""; // Lyrics formatted for HTML
        for (var c in lyrics_old) {
          if (lyrics_old.charAt(c) == '\n') {
            bottomLyrics += "<br>";
          } else {
            bottomLyrics += lyrics_old.charAt(c);
          }
        }
        let textDiv = document.getElementById("text-area");
        textDiv.innerHTML = '<p>' + bottomLyrics + '</p>';
        words = responseObj.words;
        initialDraw = true;
      } else {
        alert("The last request was for a song that either does\n" +
          "not exist, or is not available on this server.");
        // Clear words:
        words = [];
        // Clear the text area and trigger a intitialDraw:
        let textDiv = document.getElementById("text-area");
        textDiv.innerHTML = '<p></p>';
        initialDraw = true;
        drawCanvas();
      }
    });
  }
}

// Transpose functions re-written from A1 in order to handle new
// flag-based word identifiers (e.g.: isSpecial, isChord)
// Handles pressing of transpose up button
function handleTransposeUpButton() {
  // Loop over all of the words:
  for (let i = 0; i < words.length; i++) {
    // Test the current word with cord_regex:
    hasSlash = new RegExp("[/]");
    if (hasSlash.test(words[i].text)){
      // One of those slash chords...
      // Be super simple and just transpose the chords before and
      // after the slash without handling possible tails:
      let c1 = ""; // Chord before slash
      let c2 = ""; // Chord after slash
      let whichChord = 1; // Chord currently being appended to
      for (let j = 0; j < words[i].text.length; j++){
        if ( words[i].text[j] == "/" ) { whichChord++; continue; }
        if ( whichChord == 1 ){
          c1 += words[i].text[j];
        }
        else if ( whichChord == 2 ){
          c2 += words[i].text[j];
        }
        else{
          alert("Illegal chord found! Contains more than one / character!")
          return;
        }
      }
      for (let j = 0; j < cTranspo_regex.length; j++) {
        r1 = RegExp(cTranspo_regex[j].regex1);
        r2 = RegExp(cTranspo_regex[j].regex2);
        if (
          r1.test(c1 + " ") ||
          r2.test(c1 + " ")
        ) {
          if ( j < (cTranspo_regex.length - 1)){
            c1 = cTranspo_regex[j + 1].chord;
            break;
          } else {
            c1 = cTranspo_regex[0].chord;  
            break;
          }
        }
      }
      for (let n = 0; n < cTranspo_regex.length; n++) {
        r1 = RegExp(cTranspo_regex[n].regex1);
        r2 = RegExp(cTranspo_regex[n].regex2);
        if (
          r1.test(c2 + " ") ||
          r2.test(c2 + " ")
        ) {
          if ( n < (cTranspo_regex.length - 1) ) {
            c2 = cTranspo_regex[n + 1].chord; // Why does this crash?
            break;
          }
           else {
            c2 = cTranspo_regex[0].chord;  
            break;
          }
        }
      }
      // Finally, assemble it and set words[i].text:
      words[i].text = c1 + "/" + c2;
      continue;
    }
    if (words[i].isChord) {
      for (let j = 0; j < cTranspo_regex.length; j++) {
        r1 = RegExp(cTranspo_regex[j].regex1);
        r2 = RegExp(cTranspo_regex[j].regex2);
        if (
          r1.test(words[i].text + " ") ||
          r2.test(words[i].text + " ")
        ) {
          slashBoi = false;
          // Matched this chord, check if it has a tail and transpose it:
          let tail = "";
          if (words[i].text.length != cTranspo_regex[j].chord.length) {
            // Has a tail:
            for (let k = cTranspo_regex[j].chord.length; k < words[i].text.length; k++) {
              tail += words[i].text[k];
            }
          }
          if (tail) {
            if (j < cTranspo_regex.length - 1) {
              words[i].text = cTranspo_regex[j + 1].chord + tail;
            } else {
              words[i].text = cTranspo_regex[0].chord + tail;
            }
          } else {
            if (j < cTranspo_regex.length - 1) {
              words[i].text = cTranspo_regex[j + 1].chord;
            } else {
              words[i].text = cTranspo_regex[0].chord;
            }
          }
          break;
        }
      }
    }
  }
  drawCanvas();
}

// Handles pressing of transpose down button
function handleTransposeDownButton() {
  // Loop over all of the words:
  for (let i = 0; i < words.length; i++) {
    // Test the current word with cord_regex:
    hasSlash = new RegExp("[/]");
    if (hasSlash.test(words[i].text)){
      // One of those slash chords...
      // Be super simple and just transpose the chords before and
      // after the slash without handling possible tails:
      let c1 = ""; // Chord before slash
      let c2 = ""; // Chord after slash
      let whichChord = 1; // Chord currently being appended to
      for (let j = 0; j < words[i].text.length; j++){
        if ( words[i].text[j] == "/" ) { whichChord++; continue; }
        if ( whichChord == 1 ){
          c1 += words[i].text[j];
        }
        else if ( whichChord == 2 ){
          c2 += words[i].text[j];
        }
        else{
          alert("Illegal chord found! Contains more than one / character!")
          return;
        }
      }
      for (let j = 0; j < cTranspo_regex.length; j++) {
        r1 = RegExp(cTranspo_regex[j].regex1);
        r2 = RegExp(cTranspo_regex[j].regex2);
        if (
          r1.test(c1 + " ") ||
          r2.test(c1 + " ")
        ) {
          if ( j > 0 ) {
            c1 = cTranspo_regex[j - 1].chord;
            break;
          } else {
            c1 = cTranspo_regex[cTranspo_regex.length - 1].chord;  
            break;
          }
        }
      }
      for (let j = 0; j < cTranspo_regex.length; j++) {
        r1 = RegExp(cTranspo_regex[j].regex1);
        r2 = RegExp(cTranspo_regex[j].regex2);
        if (
          r1.test(c2 + " ") ||
          r2.test(c2 + " ")
        ) {
          if ( j > 0 ) {
            c2 = cTranspo_regex[j - 1].chord;
            break;
          } else {
            c2 = cTranspo_regex[cTranspo_regex.length - 1].chord;  
            break;
          }
        }
      }
      // Finally, assemble it and set words[i].text:
      words[i].text = c1 + "/" + c2;
      continue;
    }
    if (words[i].isChord) {
      for (let j = 0; j < cTranspo_regex.length; j++) {
        r1 = RegExp(cTranspo_regex[j].regex1);
        r2 = RegExp(cTranspo_regex[j].regex2);
        if (
          r1.test(words[i].text + " ") ||
          r2.test(words[i].text + " ")
        ) {
          // Matched this chord, check if it has a tail and transpose it:
          let tail = "";
          if (words[i].text.length != cTranspo_regex[j].chord.length) {
            // Has a tail:
            for (let k = cTranspo_regex[j].chord.length; k < words[i].text.length; k++) {
              tail += words[i].text[k];
            }
          }
          if (tail) {
            if (j > 0) {
              words[i].text = cTranspo_regex[j - 1].chord + tail;
              break;
            } else {
              words[i].text = cTranspo_regex[cTranspo_regex.length - 1].chord + tail;
              break;
            }
          } else {
            if (j > 0) {
              words[i].text = cTranspo_regex[j - 1].chord;
              break;
            } else {
              words[i].text = cTranspo_regex[cTranspo_regex.length - 1].chord;
              break
            }
          }
        }
      }
    }
  }
  drawCanvas();
}

// Re-written to match that used in tutorial 4 (no JQueary),
// chose not to remove all JQueary as time restrictions were in place; why fix
// what isn't broken? (or more likely, why break what isn't broken)
// Called after all requested content is recieved from server on initial load.
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("canvas1").addEventListener('mousedown', handleMouseDown);
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  timer = setInterval(handleTimer, 100);
  drawCanvas();
});