
// const db_name = 'assFive'
// const db_collection = 'logFile'
// let database

// const fs= require('fs')
// const mc = require('mongodb').MongoClient

// mc.connect('mongodb://localhost:27017', (err, client) => {
// 	if (err) throw err
// 	database = client.db(db_name).collection(db_collection)
// 	console.log('connect to database');

// })


 function transformLog(file,database,callback) {
    //Mar  9 07:39:41 chimera colord[892]: (colord:892): Cd-WARNING **: failed to get
    // "file" : { "fieldname" : "theFile", "originalname" : "syslog.2", "encoding" : "7bit", "mimetype" : "application/octet-stream", 

    let insertObj = {
        "filename": file.originalname
    }
    let data = []
    let lines = []
    lines = file.buffer.toString().split('\n')

    for (let line of lines) {
        let lineInfo = []
        if (line) {
            lineInfo = line.split(' ').filter(e=>{return e!==''})//filer white space
            // console.log(lineInfo)
            let entry = {}
            if (lineInfo.length > 5) {
                entry.date = lineInfo[0] + " " + lineInfo[1];
                entry.time = lineInfo[2];
                entry.host=lineInfo[3]
                entry.service = lineInfo[4].slice(0, -1);  // drop the trailing colon
                entry.message = lineInfo.slice(5).join(' ');//argv[6] rest 
                data.push(entry)
            }
        }

    }
    insertObj['data'] = data
    database.insertOne(insertObj, (err, result) => {
        console.log('uploaded');
        console.log(JSON.stringify(insertObj));
        
        // res.send('success')
        callback()
    })
}

// var dir = '../logtxt/syslog.2'
// fs.readFile(dir,(err,data)=>{
//     let file={}
//     file.originalname = 'syslog.2'
//     file.buffer = data
// // transformLog(file,database)
    
// })
module.exports = transformLog