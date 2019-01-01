/*
Client-side javascript for 2406 assignment 2
(c) Louis D. Nel 2018

*/


let words = [] //array of drag-able lyrics and chords

//leave this moving word for fun and for using it to
//provide status info to client.
//NOT part of assignment requirements
let movingString = {word: "Moving",
                    x: 100,
					y:100,
					xDirection: 1, //+1 for leftwards, -1 for rightwards
					yDirection: 1, //+1 for downwards, -1 for upwards
					stringWidth: 50, //will be updated when drawn
					stringHeight: 24}; //assumed height based on drawing point size


let timer //timer for animation of moving string etc.
let wordBeingMoved //word being dragged by the mouse
let deltaX, deltaY //location where mouse is pressed relative to word origin
const canvas = document.getElementById('canvas1') //our drawing canvas
const fontPointSize = 18 //point size for chord and lyric text
const wordHeight = 20 //estimated height of a string in the editor
const editorFont = 'Courier New' //font for your editor -must be monospace font
const lineHeight = 40 //nominal height of text line
const lyricLineOffset = lineHeight*5/8 //nominal offset for lyric line below chords
const topMargin = 40 //hard coded top margin white space of page
const leftMargin = 40 //hard code left margin white space of page

let wordTargetRect = {x: 0, y:0, width: 0, height: 0} //used for debugging
                                                       //rectangle around word boundary


function getWordAtLocation(aCanvasX, aCanvasY){

	  //locate the word near aCanvasX,aCanvasY co-ordinates
	  //aCanvasX and aCanvasY are assumed to be X,Y loc
	  //relative to upper left origin of canvas

	  //used to get the word mouse is clicked on

	  let context = canvas.getContext('2d');

	  for(let i=0; i<words.length; i++){
	     let wordWidth = context.measureText(words[i].word).width
		 if((aCanvasX > words[i].x && aCanvasX < (words[i].x + wordWidth))  &&
			    (aCanvasY > words[i].y - wordHeight && aCanvasY < words[i].y)) {
			//set word targeting rectangle for debugging
			wordTargetRect = {x: words[i].x, y: words[i].y-wordHeight, width: wordWidth, height : wordHeight}
			return words[i]
      } //return the word found
	  }
	  return null //no word found at location
    }

function drawCanvas(){

  let context = canvas.getContext('2d')
	let lyricFillColor = 'cornflowerblue'
	let lyricStrokeColor = 'blue'
	let chordFillColor = 'green'
	let chordStrokeColor = 'green'

    context.fillStyle = 'white'
    context.fillRect(0,0,canvas.width,canvas.height) //erase canvas

    context.font = '' + fontPointSize + 'pt ' + editorFont
    context.fillStyle = 'cornflowerblue'
    context.strokeStyle = 'blue'

	//draw drag-able lyric and chord words
    for(var i=0; i<words.length; i++){
			var data = words[i]
			if(data.lyric){
			    context.fillStyle = lyricFillColor
				context.strokeStyle = lyricStrokeColor
			}
			if(data.chord){
			    context.fillStyle = chordFillColor
				context.strokeStyle = chordStrokeColor
			}
			context.fillText(data.word, data.x, data.y)
            context.strokeText(data.word, data.x, data.y)
	}

	//draw box around word last targeted with mouse -for debugging
	//context.strokeRect(wordTargetRect.x, wordTargetRect.y, wordTargetRect.width, wordTargetRect.height);

    context.fillStyle = 'red'
    movingString.stringWidth = context.measureText(	movingString.word).width
    //context.fillText(movingString.word, movingString.x, movingString.y);


}

function getCanvasMouseLocation(e){
   //provide the mouse location relative to the upper left corner
   //of the canvas

   /*
   This code took some trial and error. If someone wants to write a
   nice tutorial on how mouse-locations work that would be great.
   */
	let rect = canvas.getBoundingClientRect()

	//account for amount the document scroll bars might be scrolled
	let scrollOffsetX = $(document).scrollLeft()
	let scrollOffsetY = $(document).scrollTop()

    let canX = e.pageX - rect.left -scrollOffsetX
    let canY = e.pageY - rect.top -scrollOffsetY

	return {canvasX: canX, canvasY: canY}

}

function handleMouseDown(e){

	let canvasMouseLoc = getCanvasMouseLocation(e)
	let canvasX = canvasMouseLoc.canvasX
	let canvasY = canvasMouseLoc.canvasY
	console.log("mouse down:" + canvasX + ", " + canvasY)

	wordBeingMoved = getWordAtLocation(canvasX, canvasY)
	//console.log(wordBeingMoved.word)
	if(wordBeingMoved != null ){
	   deltaX = wordBeingMoved.x - canvasX
	   deltaY = wordBeingMoved.y - canvasY
	   $("#canvas1").mousemove(handleMouseMove)
	   $("#canvas1").mouseup(handleMouseUp)

	}

    // Stop propagation of the event and stop any default
    // browser action

    e.stopPropagation()
    e.preventDefault()

	drawCanvas()
	}

function handleMouseMove(e){

	//console.log("mouse move");

	let canvasMouseLoc = getCanvasMouseLocation(e)
	let canvasX = canvasMouseLoc.canvasX
	let canvasY = canvasMouseLoc.canvasY

	console.log("move: " + canvasX + "," + canvasY)

	wordBeingMoved.x = canvasX + deltaX
	wordBeingMoved.y = canvasY + deltaY

	e.stopPropagation()

	drawCanvas()
	}

function handleMouseUp(e){
	//console.log("mouse up")
	e.stopPropagation()

	//remove mouse move and mouse up handlers but leave mouse down handler
    $("#canvas1").off("mousemove", handleMouseMove); //remove mouse move handler
    $("#canvas1").off("mouseup", handleMouseUp); //remove mouse up handler

	drawCanvas() //redraw the canvas
	}


function handleTimer(){
	movingString.x = (movingString.x + 5*movingString.xDirection)
	movingString.y = (movingString.y + 5*movingString.yDirection)

	//keep moving string within canvas bounds
	if(movingString.x + movingString.stringWidth > canvas.width) movingString.xDirection = -1
	if(movingString.x < 0) movingString.xDirection = 1
	if(movingString.y > canvas.height) movingString.yDirection = -1
	if(movingString.y - movingString.stringHeight < 0) movingString.yDirection = 1

	drawCanvas()
}

    //KEY CODES
	//should clean up these hard coded key codes
	const ENTER = 13
	const RIGHT_ARROW = 39
	const LEFT_ARROW = 37
	const UP_ARROW = 38
	const DOWN_ARROW = 40


function handleKeyDown(e){

	//console.log("keydown code = " + e.which );
    const keyCode = e.which
    if(keyCode == UP_ARROW | keyCode == DOWN_ARROW){
       //prevent browser from using these with text input drop downs
       e.stopPropagation()
       e.preventDefault()
	}

}

function handleKeyUp(e){
	//console.log("key UP: " + e.which);
	if(e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW){
         //do nothing for now
	}

	if(e.which == ENTER){
	   handleSubmitButton() //treat ENTER key like you would a submit
	   $('#userTextField').val('') //clear the user text field
	}

	e.stopPropagation()
  e.preventDefault()

}

function parseChordProFormat(chordProLinesArray){
  //parse the song lines with embedded chord pro chords into individual
	//lyric and chord lines and also into individually movable words and chord symbols

	//clear any newline or return characters as a precaution -probably not needed
	for(var i=0; i<chordProLinesArray.length; i++) {
        chordProLinesArray[i] = chordProLinesArray[i].replace(/(\r\n|\n|\r)/gm,"")
	}

	//split chord pro format line into character aligned strings of just chords
	//and just lyrics
    let chordLine = '' //string representing just the chords
    let lyricLine = '' //string representing just the lyrics


    let textDiv = document.getElementById("text-area")
    textDiv.innerHTML = ''

    for(let i=0; i<chordProLinesArray.length; i++) {
       let line = chordProLinesArray[i]
	   textDiv.innerHTML = textDiv.innerHTML + `<p> ${line}</p>`
	   let isReadingChord = false
     chordLine = ''
	   lyricLine = ''
	   let chordLength = 0 //length of chord symbol


	   for(let charIndex = 0; charIndex < line.length; charIndex++) {
	    let ch = line.charAt(charIndex)
		  if(ch === '['){
        isReadingChord = true
        chordLength = 0
        //make sure there is a blank between two adjacent chords
        if(chordLine.length > 0 && !chordLine.endsWith(" ")) chordLine = chordLine + " "
      }
		  if(ch === ']'){
        isReadingChord = false
      }
		  if(!isReadingChord && ch != ']'){
	         lyricLine = lyricLine + ch
		     if(chordLength > 0) chordLength--
		     else chordLine = chordLine + " "
		  }
		  if(isReadingChord && ch != '['){
		     chordLine = chordLine + ch
		     chordLength++
		  }

	   }

 	 //Now turn the chord line and lyrics line into individual drag-able words
	 //Create Movable Words from the chord and lyric lines
	 let characterWidth = canvas.getContext('2d').measureText('m').width;  //width of one character

	 //Make drag-able chord symbol words
	 chordLine += ' ' //add blank to chord line just so line ends in blank
	 if(chordLine.trim().length > 0){
	   let theChordSymbol = ''
	   let theChordLocationIndex = -1
	   for(let j=0; j<chordLine.length; j++){
	      let ch = chordLine.charAt(j)
		  if(ch == ' '){
		    //start or end of a chord
			if(theChordSymbol.trim().length > 0){

			   words.push({word: theChordSymbol,
			               x: leftMargin + theChordLocationIndex * characterWidth,
                           y: topMargin + i * 2 * lineHeight,
						   chord: 'chord'
                           })

			}
		  theChordSymbol = ''
			theChordLocationIndex = -1

		  }
      else{
		    //part of a chord symbol
			theChordSymbol += ch
			if(theChordLocationIndex === -1) theChordLocationIndex = j
		 }
	   }
	 } //end make dra-gable chord words

	 //Make drag-able lyric words
	 lyricLine += ' '; //add blank to lyrics line just so it ends in a blank
	 if(lyricLine.trim().length > 0){
	   let theLyricWord = ''
	   let theLyricLocationIndex = -1
	   for(let j=0; j<lyricLine.length; j++){
	      let ch = lyricLine.charAt(j)
		  if(ch == ' '){
		    //start or end of a chord
			if(theLyricWord.trim().length > 0){

			   words.push({word: theLyricWord,
			               x: leftMargin + theLyricLocationIndex * characterWidth,
                           y: topMargin + i * 2 * lineHeight + lyricLineOffset,
						   lyric: 'lyric'
                           })

			}
		    theLyricWord = ''
			theLyricLocationIndex = -1

		  }
      else{
		    //its part of a lyric word
			theLyricWord += ch
			if(theLyricLocationIndex === -1) theLyricLocationIndex = j
		 }
	   }
	 } //end make lyric chord words
  }

}


function handleSubmitButton () {

    let userText = $('#userTextField').val() //get text from user text input field
	if(userText && userText !== ''){
	   let userRequestObj = {text: userText}
       let userRequestJSON = JSON.stringify(userRequestObj)
	   $('#userTextField').val('') //clear the user text field

       //alert ("You typed: " + userText);
	   $.post("fetchSong", userRequestJSON, function(data, status){
			console.log("data: " + data)
			console.log("typeof: " + typeof data)
			let responseObj = data
			movingString.word = responseObj.text
			words = [] //clear drag-able words array;
			if(responseObj.songLines) parseChordProFormat(responseObj.songLines)
			})
	}

}

function realignLyicsAndChords(){
   //realign the lyric and chord drag-able words in the words array
   //modify chord and lyric y values to realign them

   //move chords on top of the lyric lines (i.e. same y values)
   //This will be restored at the end of this function
   for(let i=0; i<words.length; i++){
	      //move chords down to the lyrics level
	      if(words[i].chord) {
		      words[i].oldY = words[i].y
		      words[i].y = words[i].y + lyricLineOffset
		  }
	  }
   //sort words array vertically
   words.sort(function(wordA, wordB){
       if(wordA.y < wordB.y) return -1
	   if(wordA.y === wordB.y) return 0
	   if(wordA.y > wordB.y) return 1
   })


   //go through words and gather any considered to be on the same line (vertical alignment)
   let linesToSaveArray = [] //words lines to save
   let currentLineArray = [] //current line
   let currentHeight = -1
   for(let i=0; i<words.length; i++){
	      //gather words at the same level in the currentLineArray
		  if(currentHeight === -1) currentHeight = words[i].y
	      if(Math.abs(words[i].y - currentHeight) < lyricLineOffset) {
		     words[i].y = currentHeight
			 currentLineArray.push(words[i])
		  }
		  else {
		    currentHeight = words[i].y
			linesToSaveArray.push(currentLineArray)
			currentLineArray = []
			currentLineArray.push(words[i])
		  }
	  }
	if(currentLineArray.length > 0) linesToSaveArray.push(currentLineArray); //push last line

	let songLinesToSave = [] //array or strings to have to server file
	console.log('lines to save length: ' + linesToSaveArray.length)
	for(let i=0; i<linesToSaveArray.length; i++){
	   //convert words to single string embedding chord symbols
	   let stringToSave = convertWordsToString(linesToSaveArray[i])
	   songLinesToSave.push(stringToSave)
	}

	//Restore old chord locations
	for(let i=0; i<words.length; i++){
	      //restore old chord positions
	      if(words[i].chord) {
		      words[i].y = words[i].y - lyricLineOffset
		  }
	  }

	return songLinesToSave //lines to save to file
}

function convertWordsToString(arrayOfWords){
   //Convert an array of drag-able word objects into a single string
   //and also embed the chords into the lyrics within "[]" brackets

   //sort horizontally the words by their word.x values
   //this will determine their order in the string
   	arrayOfWords.sort(function(wordA, wordB){
              if(wordA.x < wordB.x) return -1
	          if(wordA.x === wordB.x) return 0
	          if(wordA.x > wordB.x) return 1
			})

   let chordsOnly = []
   let wordsOnly = []
   //separate words and chords into different arrays for convenience
   for(let i=0; i<arrayOfWords.length; i++){
      if(arrayOfWords[i].lyric) wordsOnly.push(arrayOfWords[i])
      if(arrayOfWords[i].chord) chordsOnly.push(arrayOfWords[i])
   }

   if(wordsOnly.length === 0){
      //chords only, there are no lyrics to deal with
	  let theString = ''
	  for(let i=0; i<chordsOnly.length; i++){
	     theString += '[' + chordsOnly[i].word + ']'
		 theString += ' ' //blank
	  }
	  return theString.trim()
   }

   if(chordsOnly.length === 0){
      //lyrics only, there are no chords to deal with
	  let theString = ''
	  for(let i=0; i<wordsOnly.length; i++){
	     theString += wordsOnly[i].word
		 theString += ' ' //blank
	  }
	  return theString.trim()
   }


   //There are both chords and lyrics to deal with
   //embed chords into lyrics with chords placed within "[]".
   let characterWidth = canvas.getContext('2d').measureText('m').width;  //width of one character
   let currentPositionX = 0
   let theString = ''
   while(chordsOnly.length > 0 && chordsOnly[0].x <= wordsOnly[0].x){
      //place initial chords on result string
      theString += '[' + chordsOnly[0].word + ']';
	  chordsOnly.reverse();
      chordsOnly.pop();  //pop front item off
      chordsOnly.reverse();
   }
   for(let i=0; i<wordsOnly.length; i++){
        currentPosition = wordsOnly[i].x
	    let lyricStr = wordsOnly[i].word
	    for(let chIdx = 0; chIdx < lyricStr.length; chIdx++){
              while(chordsOnly.length > 0 && chordsOnly[0].x <= currentPosition){
                //embed the chord symbol
                theString += '[' + chordsOnly[0].word + ']'
	            chordsOnly.reverse()
                chordsOnly.pop(); //pop front item off
                chordsOnly.reverse()
              }
		   theString += lyricStr.charAt(chIdx)
		   currentPosition += characterWidth

		}
		theString += ' ' //insert blank
		currentPosition += characterWidth

   }
   //place any remaining chord symbols
   while(chordsOnly.length > 0 ){
         //embed the chord symbol
         theString += '[' + chordsOnly[0].word + ']' + ' '
	     chordsOnly.reverse()
         chordsOnly.pop();  //pop front item off
         chordsOnly.reverse()
    }

   //return the chord pro formatted string
   return theString.trim()
}

function handleSaveAsButton(){

   //Send song lyrics and chords to server to save in sever file system.
   console.log("Save As...");
   let userText = $('#userTextField').val(); //get text from user text input field

   console.log('****song lines to save *****')
   let textDiv = document.getElementById("text-area")
   textDiv.innerHTML = '';
   let songLinesToSaveToFile = realignLyicsAndChords();
   for(let i=0; i<songLinesToSaveToFile.length; i++){
	     console.log(songLinesToSaveToFile[i])
		 textDiv.innerHTML = textDiv.innerHTML + `<p> ${songLinesToSaveToFile[i]}</p>`
   }
   if(userText && userText !=='' && words.length > 0){
      let userRequestObj = {text: 'save'}
      let saveAsFileName = userText //file path to save on server
      userRequestObj.saveAsFileName = saveAsFileName


	  userRequestObj.songLines = songLinesToSaveToFile

      let userRequestJSON = JSON.stringify(userRequestObj);
      $('#userTextField').val(''); //clear the user text field

	   //send lyric data to server to save in server file system;
	   $.post("saveSong", userRequestJSON, function(data, status){
			//console.log("data: " + data);
			//console.log("typeof: " + typeof data);
			//var responseObj = JSON.parse(data);
			let responseObj = data
			movingString.word = responseObj.text
			})

   }

}

function handleRefreshButton(){

   //Send song lyrics and chords to server to save in sever file system.
   console.log("Refresh...");

   console.log('****song lines to refresh *****');
   let textDiv = document.getElementById("text-area")
   textDiv.innerHTML = '';
   let songLinesToSaveToFile = realignLyicsAndChords();
   for(let i=0; i<songLinesToSaveToFile.length; i++){
	     console.log(songLinesToSaveToFile[i])
		 textDiv.innerHTML = textDiv.innerHTML + `<p> ${songLinesToSaveToFile[i]}</p>`
   }

}

function transpose(theWords, semitones){
  //Transpose any of the chords in the array of word objects theWords by
  //semitones number of musical steps or semi-tones.
  //semitones is expected to be an integer between -12 and +12
  if(semitones === 0) return //nothing to do
  for (let i = 0; i < words.length; i++) {
    if (words[i].chord) {
      words[i].word = transposeChord(words[i].word, semitones)
    }
  }
}

function transposeChord(aChordString, semitones){
  console.log(`transposeChord: ${aChordString} by ${semitones}`)
  /*transpose aChordString by semitones
  aChordString is expected to be like: '[Gm7]' or '[F#maj7]'
  Strategy: look for the position of the chord letter name in hard-coded array of
  letter names and if found replace the characters with the ones offset by the argument
  semitones.
  For example to transpose A#m up by three semitones find for A# in RootNamesWithSharps
  array (which would be 1) then replace A# with the name found at RootsNamesWithSharps[1+3]
  which would be C#. Hence A#m transposed up three semitones would be C#m.
  */
  const RootNamesWithSharps = ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#']
  const RootNamesWithFlats = ['A','Bb','B','C','Db','D','Eb','E','F','Gb','G','Ab']
  let rootNames = RootNamesWithSharps
  let rootNameIndex = -1
  let transposedChordString = ''
  for(let i = 0; i< aChordString.length; i++){
    if(rootNames.findIndex(function(element){return element === aChordString[i]}) === -1) {
      //character is not start of a chord root name (i.e. is not A,B,C,D,E,F, or G)
      if((aChordString[i] !== '#') && (aChordString[i] !== 'b')) //skip # and b suffix
         transposedChordString += aChordString[i]
    }
    else {
      //character is start of a chord name root (i.e. A,B,C,D,E,F, or G)
      let indexOfSharp = -1
      let indexOfFlat = -1
      //check to see if we are dealing with names like A# or Bb
      if(i<aChordString.length -1){
        indexOfSharp = RootNamesWithSharps.findIndex(function(element){return element === (aChordString[i] + aChordString[i+1])})
        if(indexOfSharp !== -1) transposedChordString += RootNamesWithSharps[(indexOfSharp + 12 + semitones) % 12]
        indexOfFlat = RootNamesWithFlats.findIndex(function(element){return element === (aChordString[i] + aChordString[i+1])})
        if(indexOfFlat !== -1) transposedChordString += RootNamesWithFlats[(indexOfFlat + 12 + semitones) % 12]
      }
      if((indexOfSharp === -1) && (indexOfFlat === -1)){
         //chord name is letter without a # or b
         let index = rootNames.findIndex(function(element){return element === aChordString[i]})
         if(index !== -1) transposedChordString += rootNames[(index + 12 + semitones) % 12]
      }
    }
  }
  return transposedChordString
}

function handleTransposeUpButton(){
  transpose(words, 1)
  drawCanvas()
}

function handleTransposeDownButton(){
  transpose(words, -1)
  drawCanvas()
}


$(document).ready(function(){
	//This is called after the broswer has loaded the web page

	//add mouse down listener to our canvas object
	$("#canvas1").mousedown(handleMouseDown)

	//add key handler for the document as a whole, not separate elements.
	$(document).keydown(handleKeyDown)
	$(document).keyup(handleKeyUp)

	timer = setInterval(handleTimer, 100)
    //timer.clearInterval(); //to stop

	drawCanvas()
})
