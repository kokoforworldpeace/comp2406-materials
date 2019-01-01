const db_name = "graph-demo"
const collection_name = "answers"
const mc = require('mongodb').MongoClient;
var questions = {
	color: "Favorite color?",
	day: "Favorite day of the week?",
	dog: "Favorite dog breed?"
}


mc.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
	if (err) throw err
	c = client
	database = client.db(db_name).collection(collection_name)
	calcResultsStats()
})
// console.log(JSON.stringify(cal()))

// cal()

var database
var c

function removeDuplicate(arr) {
	return arr.filter(function (item, index) {
		return arr.indexOf(item) == index;
	})
}
var answer1 = {
	firstname: "aa",
	color: "green",
	day: "Tuesday",
	dog: "Favorite dog breed?"

}
var answer2 = {
	firstname: "bb",
	color: "red",
	day: "Monday",
	dog: "Favorite dog breed?"

}
var answer3 = {
	firstname: "aa",
	color: "green",
	day: "Tuesday",
	dog: "Favorite dog breed?"

}
var answers = []
answers.push(answer1)
answers.push(answer2)
answers.push(answer3)

function cal(answers) {

	
	questions.forEach(ques => {
		searchOBJ[attr] = val
		returnObj[attr].nums = []


		database.find(searchOBJ).count((err, num) => {
			returnObj[attr].nums.push(num)

			console.log(returnObj);
			
			// return returnObj
			// callback(num)
		})
		
		// console.log(returnObj);




	});
	
	

}
function getLabs(){
	let keys=[]
	// let returnObj={}
	let values=[]


	keys = Object.keys(questions)
	// for (let attr of keys) {
		
		keys.forEach(attr=>{

		let searchOBJ = {}
		// returnObj[attr] = {}

		database.distinct(attr, (err, vals) => {
			// console.log(vals);
			// returnObj.vals=vals
			// returnObj[attr].vals = []

			// returnObj[attr].vals = vals
			values=vals
			
			return values
			
			


		})
		
		
	})
	
}
function calcResultsStats() {




	Object.keys(questions).forEach(question => {
		let labs = []
		let vals = []



		search().toArray((err, allObj) => {
			if (err) throw err

			//e=color
			// allObj.forEach(obj => {
			// 	labs.push(obj[question])
			// });
			for (let obj of allObj) {
				labs.push(obj[question])
			}

			labs = removeDuplicate(labs)
			labs.forEach(lab => {
				let searchOBJ = {
				}

				searchOBJ[question] = lab
				search(searchOBJ).count((err, num) => {
					if (err) throw err
					console.log(num);

					vals.push(num)
					console.log(`labs:${labs}`);
					console.log(`vals:${vals}`);
					console.log(`result:${resultsStats}`);
					return resultsStats.push({
						questionName: question,
						questionText: questions[question],
						labels: labs,
						values: vals
					})

				})




				// console.log(resultsStats)
			})

		})






	})




}







