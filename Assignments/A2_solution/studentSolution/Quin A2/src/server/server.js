// Really whips the llammas ass.
// Re-writing things from scratch to make it clean, and ensure I bloody
// well know what all the code does! (so, for fun)
// Note that some code is still copied and pasted from A1, because it'd be silly
// to write out things that are worth keeping!

// Requirements:
const http = require( "http" ); // Uh, http stuff
const fs = require( "fs" ); // For reading files
const url = require( "url" ); // To parse URL strings

const ROOT_DIR = "../client"; // Dir to serve static files from

const MIMES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "application/javascript",
  json: "application/json",
  png: "image/png",
  svg: "image/svg+xml",
  txt: "text/plain"
}

// Checks a file extension against known MIMES:
const getMime = ( filename ) => {
  for ( let ext in MIMES ){
    if ( filename.indexOf( ext, filename.length - ext.length ) != -1 )
    return MIMES[ext];
  }
  return MIMES[ "txt" ]; // Browsers generally handle this for us, so just toss
  // it .txt and hope it's smarter than us.
}

http.createServer( ( request, response ) => {
  let urlObj = url.parse(request.url, true, false);
  console.log( "\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" );
  console.log( "PATHNAME: " + urlObj.pathname );
  console.log( "REQUEST: " + ROOT_DIR + urlObj.pathname )
  console.log( "METHOD: " + request.method )
  
  let recievedData = "";
  // Runs when data is recieved, adding data chunk to recievedData:
  request.on( "data", ( chunk ) => {
    recievedData += chunk;
  });
  
  // Runs when the end of a message is reached.
  // Pretty much everything happens here in terms of client-message processing
  // and sending of responses (in JSON, because rip XML):
  request.on( "end", () => {
    console.log( "\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" );
    console.log( "received data: ", recievedData )
    console.log( "type: ", typeof recievedData )
    
    // If the message was a POST request, then provide the client with the
    // requested content:
    if ( request.method == "POST" ){
      var package = {}; // A present for the client (requested files, if found)
      // Then bloody well handle it!:

      let dataObj = JSON.parse( recievedData );
      let parseForClient = false;
      if ( urlObj.pathname == "/newSong" ){
        if ( dataObj.saveMe == true ){
          console.log("Saving file \"" + dataObj.title + "\"...");
          let savePath = '../../storage/songs/' + dataObj.title + ".txt";
          fs.writeFile(savePath, dataObj.text, (err) => {
            if (err){
              return console.log(err);
            }
            console.log("Saved file!");
          });
          return;
        }
        // Otherwise it's to be parsed and sent back (refresh button)
        parseForClient = true;
      }
      
      // Print possibly interesting stuff to the console:
      console.log( "\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" );
      console.log("received data object: ", dataObj)
      console.log("type: ", typeof dataObj)
      console.log("USER REQUEST: " + dataObj.text)
      
      
      
      // Now it's time to check for the existance of the requested song, and
      // if found, parse it!
      
      if ( parseForClient ){
        let words = [];
        let word = ""; // The word currently being assembled
        let chord = ""; // The chord currently being assembled
        let onChord = false; // Whether a chrod is being assembled
        let lyrics = dataObj.text; // Loaded text
        
        for ( let idx = 0; idx < lyrics.length; idx++ ){
          let char = lyrics.charAt(idx);
          let regex = new RegExp("[.,!? ]");
          if ( !( regex.test(char) || char == "\n" ) ){
            if ( char == "[" ){
              onChord = true;
            }
            else if ( char == "]" ){
              onChord = false;
              if ( idx < lyrics.length - 1 ){
                let regex2 = new RegExp("[.,!?]");
                if ( regex2.test( lyrics.charAt( idx + 1 ) ) ){
                  // Push the word first, then the special character,
                  // then the chord
                  words.push({
                    text: word,
                    xOffSet: "",
                    isChord: false,
                    inWord: false,
                    special: false
                  });
                  word = "";
                  words.push({
                    text: chord,
                    xOffSet: "",
                    isChord: true,
                    inWord: false,
                    special: true // Because it goes [CHORD][.,!?]
                  });
                  chord = "";
                  words.push({
                    text: lyrics.charAt( idx + 1 ),
                    xOffSet: false,
                    isChord: false,
                    inWord: false,
                    special: false // Want a space after this one!
                  })
                  idx++;
                  continue;
                }
              }
              if ( word != "" ){
                words.push({
                  text: chord,
                  xOffSet: word,
                  isChord: true,
                  inWord: true,
                  special: false
                });
              }
              else{
                words.push({
                  text: chord,
                  xOffSet: word,
                  isChord: true,
                  inWord: false,
                  special: false
                });
              }
              chord = "";
              continue;
            }
            if ( onChord ){
              if ( char != "[" )
              chord += char;
              continue;
            }
            word += char;
            continue;
          }
          if ( char != " " ){
            word += char;
          }
          if ( word != "" ){
            let regex = new RegExp("[!,?;:.]");
            let isSpecial = false;
            if ( regex.test( word ) && word.length == 1 ) isSpecial = true;
            words.push({
              text: word,
              xOffSet: "",
              isChord: false,
              inWord: false,
              special: isSpecial
            });
          }
          word = ""; // Reset the word
          if ( char == "\n" ){
            // It's a newline, so represent it with <br> like html so the
            // client can parse it out and insert a newline on the canvas:
            words.push({
              text: "<br>",
              xOffSet: "",
              isChord: false,
              inWord: false
            });
          }
        }
        package.allClear = true;
        package.words = words;
        package.lyrics = lyrics;
        package.found = true;
        response.writeHead( 200, { "Content-Type": MIMES["txt"] } );
        response.end( JSON.stringify( package ) );
      }
      else{
        fs.readdir('../../storage/songs', (err, files) => {
          // Never really handled, but it's always fun to thorw things:
          if ( err ) throw err;
          // Loop over all the files in the directory:
          package.found = false;
          for ( let f in files ){
            console.log(files[f]);
            if ( files[f] == ( dataObj.text + ".txt" ) ){
              console.log("Requested file found; proceeding to load it");
              package.found = true; // Let the client know that the song was found
              
              let words = [];
              let songPath = '../../storage/songs/' + dataObj.text + ".txt"; // Full path to file
              try{
                fs.readFile( songPath, 'utf8', (err, data) => {
                  if (err) throw err;
                  let word = ""; // The word currently being assembled
                  let chord = ""; // The chord currently being assembled
                  let onChord = false; // Whether a chrod is being assembled
                  let lyrics = data; // Loaded text
                  
                  for ( let idx = 0; idx < lyrics.length; idx++ ){
                    let char = lyrics.charAt(idx);
                    let regex = new RegExp("[.,!? ]");
                    if ( !( regex.test(char) || char == "\n" ) ){
                      if ( char == "[" ){
                        onChord = true;
                      }
                      else if ( char == "]" ){
                        onChord = false;
                        if ( idx < lyrics.length - 1 ){
                          let regex2 = new RegExp("[.,!?]");
                          if ( regex2.test( lyrics.charAt( idx + 1 ) ) ){
                            // Push the word first, then the special character,
                            // then the chord
                            words.push({
                              text: word,
                              xOffSet: "",
                              isChord: false,
                              inWord: false,
                              special: false
                            });
                            word = "";
                            words.push({
                              text: chord,
                              xOffSet: "",
                              isChord: true,
                              inWord: false,
                              special: true // Because it goes [CHORD][.,!?]
                            });
                            chord = "";
                            words.push({
                              text: lyrics.charAt( idx + 1 ),
                              xOffSet: false,
                              isChord: false,
                              inWord: false,
                              special: false // Want a space after this one!
                            })
                            idx++;
                            continue;
                          }
                        }
                        if ( word != "" ){
                          words.push({
                            text: chord,
                            xOffSet: word,
                            isChord: true,
                            inWord: true,
                            special: false
                          });
                        }
                        else{
                          words.push({
                            text: chord,
                            xOffSet: word,
                            isChord: true,
                            inWord: false,
                            special: false
                          });
                        }
                        chord = "";
                        continue;
                      }
                      if ( onChord ){
                        if ( char != "[" )
                        chord += char;
                        continue;
                      }
                      word += char;
                      continue;
                    }
                    if ( char != " " ){
                      word += char;
                    }
                    if ( word != "" ){
                      let regex = new RegExp("[!,?;:.]");
                      let isSpecial = false;
                      if ( regex.test( word ) && word.length == 1 ) isSpecial = true;
                      words.push({
                        text: word,
                        xOffSet: "",
                        isChord: false,
                        inWord: false,
                        special: isSpecial
                      });
                    }
                    word = ""; // Reset the word
                    if ( char == "\n" ){
                      // It's a newline, so represent it with <br> like html so the
                      // client can parse it out and insert a newline on the canvas:
                      words.push({
                        text: "<br>",
                        xOffSet: "",
                        isChord: false,
                        inWord: false
                      });
                    }
                  }
                  package.words = words;
                  package.lyrics = lyrics;
                  package.found = true;
                  response.writeHead( 200, { "Content-Type": MIMES["txt"] } );
                  response.end( JSON.stringify( package ) );
                });
              } catch (e){
                console.log("ERROR: FILE DOESN'T EXIST!");
              }
              break; // No need to keep looping
            }
          }
          if (!package.found){
            package.words = undefined;
            package.lyrics = undefined;
            package.found = false;
            response.writeHead( 200, { "Content-Type": MIMES["txt"] } );
            response.end( JSON.stringify( package ) );
          }
        });
      }
      console.log(package);
    }
    if ( request.method == "GET" ){
      // Handle GET requests:
      let filePath = ROOT_DIR + urlObj.pathname;
      if ( urlObj.pathname === "/" )
      filePath = ROOT_DIR + "/assignment2.html";
      fs.readFile( filePath, function (err, data) {
        if (err) {
          console.log( "ERROR: " + JSON.stringify( err ) );
          response.writeHead( 404 );
          response.end( JSON.stringify( err ) );
          return;
        }
        response.writeHead( 200, { "Content-Type": getMime( filePath ) } );
        response.end(data);
      });
    }
  });
}).listen(3000);

console.log( "\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" );
console.log("Server Running at PORT 3000  CNTL-C to quit")
console.log("To Test:")
console.log("http://localhost:3000/assignment2.html\n")
console.log( "\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" );