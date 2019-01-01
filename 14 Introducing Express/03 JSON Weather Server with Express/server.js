/*
(c) 2018 Louis. D. Nel

NOTE: THIS CODE WILL NOT RUN UNTIL YOU ENTER YOUR OWN openweathermap.org APP ID KEY

NOTE: You need to intall the npm modules by executing >npm install
before running this server

Simple express server re-serving data from openweathermap.org
To test:
http://localhost:3000
or
http://localhost:3000/weather?city=Ottawa
to just set JSON response. (Note it is helpful to add a JSON formatter extension, like JSON Formatter, to your Chrome browser for viewing just JSON data.)
*/
const express = require('express') //express framework
const requestModule = require('request') //npm module for easy http requests
const PORT = process.env.PORT || 3000

/*YOU NEED AN APP ID KEY TO RUN THIS CODE
  GET ONE BY SIGNING UP AT openweathermap.org
*/
const WEATHER_API_KEY = 'ace9acb7101e06162f886f3a719e6c45' //<== 2406fall2018

const app = express()

//Middleware
app.use(express.static(__dirname + '/public')) //static server

//Routes
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.get('/weather', (request, response) => {
  let city = request.query.city
  if(!city) {
    return response.json({message: 'Please enter a city name'})
  }
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}`
  requestModule.get(url, (err, res, data) => {
    return response.contentType('application/json').json(JSON.parse(data))
  })
})

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
    console.log(`To Test:`)
    console.log(`http://localhost:3000/weather?city=Ottawa`)
    console.log(`http://localhost:3000`)

  }
})
