Name: Quin J. G. Rider
Student #: XXXXXXXXXXX

Node.js Version: 8.12.0
Os Tested on: Ubuntu 16.04, Ubuntu 18.04, Elementary OS Loki 0.4.1

Installation:
  If not present, install the latest LTS version of node.js, which can be found
  here: https://nodejs.org/en/.

Launch Instructions:
  Traverse to the src/server directory and run the server using the command
  > node server.js

Testing:
  Console output will provide a link; follow it in a browser.
  The link provided will be: http://localhost:3000/assignment2.html
  The circular button located at the top left of the page (?) displays
  the purpose of the buttons, their keybindings (if any) and instructions for
  loading a song.

Issues:
  The client-interface looks best in Chrome & Chromium; Firefox (under
  debian off-shoots, e.g.: Ubuntu, Kubuntu, Elementary, etc.) displays buttons
  in an odd mannar, displacing some them from their intended positions.

  A refresh is required before saving can take place:
  refresh aligns the words based on their new positions (if changes were made),
  snapping words to lines if they're within a given distance, or creating a new
  line if not. On refresh, chords that were previously embedded in words,
  such as some[E]thing, will be displaced from the word; whether it is displaced
  to before or after the word it was embedded in depends on how far into the
  word it was. I'm unsure if the re-embedment of chords into words was
  included in the requirement of creating a new file based on the word positions
  on the canvas, so listed it here with 'issues'.

  ***Note that when refreshing a song that has not been modified, the text will
  scale down: this is because of the affects mentioned above; the line
  has likely increased in size and thus may no longer fit within the horizontal
  restrictions, so it's scaled down. (this is not an issue, and is expected).
