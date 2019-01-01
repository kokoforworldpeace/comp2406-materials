/*
(c) 2018 Louis D. Nel

Prerequisites:

1)You must have mongodb server running on its default port 27017.

2)You must have installed the npm module: mongoose
by executing the command:

npm install mongoose
*/

/*
mongoose:

        mongoose.Schema({
          schema format and type
        })
        
        mongoose.model(modelName,modelSchema)

create object by :
              new modelName({
                schema format
              })
*/






const mongoose = require('mongoose')


//Create a schema that describes what properities cats have
var catSchema = mongoose.Schema({
  name: String,
  favouriteToy: String
})

//Create a model based on cat Schema
//A model is a class with which documents are created.
//A model wraps the schema in useful methods like .save(), .find()
var Cat = mongoose.model('Cat', catSchema)

//connect to database and add documents
let db = mongoose.connect('mongodb://localhost/cats', {
  useNewUrlParser: true
}, function(err) {
  if (err) throw err
  console.log('Successfully connected to mongodb')

  //Create instances of the model
  let catsToAdd = []
  catsToAdd.push(new Cat({
    name: "Bowie",
    favouriteToy: "BusyBee"
  }))
  catsToAdd.push(new Cat({
    name: "O'Grady",
    favouriteToy: "Yarn"
  }))
  catsToAdd.push(new Cat({
    name: "Zoom",
    favouriteToy: "Toes"
  }))
  catsToAdd.push(new Cat({
    name: "Chatner",
    favouriteToy: "Mr. Spock"
  }))
  for (let i=0; i < catsToAdd.length; i++) {
    catsToAdd[i].save(function(err, cat) {
      console.log(`saving: ${catsToAdd[i].name}`)
      if(i==catsToAdd.length-1){
        console.log('saving done');
        
        Cat.deleteMany({},(err)=>{
          console.log('deleted')
          mongoose.disconnect()
        })
      }
    })

  }
  // console.log(index);
  
  
  
  // Cat.find({'name':'Bowie'},(err,data)=>{console.log(data);
  // })

})


