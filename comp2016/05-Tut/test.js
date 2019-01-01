const fs = require('fs')
let end = false
fs.readFile('./sample.log.txt', (err, data) => {
    if (err) throw err
    let lines = []
    lines = data.toString().split('\n')
    // console.log(lines)

    lines.forEach((line,index,lines) => {
        let lineInfo = []
        if(index==lines.length-1){
            end = true;
        // console.log(end)

        }
        if (line) {
            lineInfo = line.split(' ')
            // console.log(lineInfo)
            let entry = {}
            if (lineInfo.length > 5) {
                entry.date = lineInfo[0] + " " + lineInfo[1];
                entry.time = lineInfo[2];
                entry.host = lineInfo[3];
                entry.service = lineInfo[4].slice(0, -1);  // drop the trailing colon
                entry.message = lineInfo.slice(5).join(' ');//argv[6] rest 
                console.log(entry)
            }
        }


    })
})