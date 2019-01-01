const fs = require('fs')

fs.readFile('./csvTest.csv','utf8',(err,data)=>{
    console.log(data)
})