var express = require('express');
var router = express.Router();
const mc = require('mongodb').MongoClient;


let database
const db_name = "graph-demo"
const collection_name = "answers"
var questions = {
	color: "Favorite color?",
	day: "Favorite day of the week?"
	// dog: "Favorite dog breed?"
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

function removeDuplicate(arr) {
	return arr.filter(function (item, index) {
		return arr.indexOf(item) == index;
	})
}

function extractProperty(input, result) {
	return input.forEach(element => {
		Object.keys(element).forEach(e => {
			result.push(e)
		})
	});
}
function extractValue(input, attr, output) {
	return input.forEach(e => {
		output.push(e[attr])
	})
}
var c

function insert(ans) {


	database.insertOne(ans, (err, result) => {
		if (err) throw err
		console.log(`insert done`)
		// client.close()
	})
}
mc.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
	if (err) throw err
	c = client
	database = client.db(db_name).collection(collection_name)


})
function search(obj) {

	if (obj == undefined) {
		return database.find()
	}
	console.log(JSON.stringify(obj));


	return database.find({
		$or: [
			{ firstname: { $regex: obj.name, option: `i` } },
			{ color: { $regex: obj["color"], option: `i` } },
			{
				day: { $regex: obj.day, option: `i` }
			}]
	})

}


router.get('/', function (req, res) {

	res.render('index', {
		title: 'Graphing Demo',
		questions: questions
	});
});
//form post
router.post('/add', function (req, res) {
	var answer = {
		firstname: req.body.firstname,
		color: req.body.color,
		day: req.body.day,
		dog:req.body.dog
	}
	insert(answer)

	res.redirect('/results');
});
function cal(callback) {
	let keys = []
	let returnObj = {}

	keys = Object.keys(questions)
	// for (let attr of keys) {
	keys.forEach(attr => {

		let searchOBJ = {}
		returnObj[attr] = {}

		database.distinct(attr, (err, vals) => {
			// console.log(vals);
			// returnObj.vals=vals
			returnObj[attr].labels = []

			returnObj[attr].labels = vals


			vals.forEach(val => {
				searchOBJ[attr] = val
				returnObj[attr].values = []


				database.find(searchOBJ).count((err, num) => {
					returnObj[attr].values.push(num)

					console.log(returnObj);
					callback(returnObj)

					// return returnObj
					// callback(num)
				})

				// console.log(returnObj);




			});



		})


	})



}
//post redirect to get
router.get('/results', function (req, res) {
	// var stats = calcResultsStats();
	// console.log(stats)
	cal((obj) => {
		res.render('results', {
			title: 'Survey Results',
			stats: obj,
			barwidth: 60
		});
	})
	// res.render('results', {
	// 	title: 'Survey Results',
	// 	stats: stats,
	// 	barwidth: 60
	// });
});

// app.get('/render', function (req, res, next) {
//     res.render('chart', {xlabel: "Months",
//                          ylabel: "Failure rate (%)",
//                          unit: '%',
//                          barwidth: 40,
// 			 pretty: true,
//                          items: [{value: 10, bin: "Jan"},
//                                  {value: 20, bin: "Feb"},
//                                  {value: 40, bin: "Mar"},
//                                  {value: 40, bin: "Apr"},
//                                  {value: 40, bin: "May"},
//                                  {value: 40, bin: "Jun"},
//                                  {value: 40, bin: "Jul"},
//                                  {value: 40, bin: "Aug"},
//                                  {value: 40, bin: "Sep"},
//                                  {value: 40, bin: "Oct"},
//                                  {value: 80, bin: "Nov"},
//                                  {value: 100, bin: "Dec"},
//                                 ]});
// });

module.exports = router;
