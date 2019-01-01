var express = require('express');
var router = express.Router();
let inserLog = require('./insertLog.js')//insert log to database

var ObjectId = require('mongodb').ObjectID;
let mc = require('mongodb').MongoClient

var multer = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

const db_name = 'assFive'
const db_collection = 'logFile'
let database

mc.connect('mongodb://localhost:27017', (err, client) => {
	if (err) throw err
	database = client.db(db_name).collection(db_collection)
	console.log('connect to database');

})

router.get('/', function (req, res) {
	res.render('index', {
		title: 'Log Analysis & Visualization',
		numFiles: 4,
		numEntries: 30000
	});
});

function getLogs(query, returnQuery) {
	// use query object to retrieve logs from server
	// return an array of log objects
	// NOTE: you may need to add properties to these objects to get the
	// required functionality

	console.log("Processing query:");
	console.log(query);
	/*
	var query = {
		message: req.body.message,
		service: req.body.service,
		file: req.body.file,
		month: req.body.month,
		day: req.body.day,
		queryType: req.body.queryType
	};
	*/
	
	var dummyLogs = [{
		"_id": ObjectId("56d66dffec898bf912744e0a"),
		"file": "/var/log/syslog",
		"date": "Mar 1",
		"time": "19:40:28",
		"host": "chimera",
		"service": "org.gnome.evolution.dataserver.Sources4[1753]",
		"message": "** (evolution-source-registry:2004): WARNING **: secret_service_search_sync: must specify at least one attribute to match"
	},
	{
		"_id": ObjectId("56d66dffec898bf912744e0b"),
		"file": "/var/log/syslog",
		"date": "Mar 1",
		"time": "20:17:01",
		"host": "chimera",
		"service": "CRON[3572]",
		"message": "(root) CMD ( cd / && run-parts --report /etc/cron.hourly)"
	},
	{
		"_id": ObjectId("56d66dffec898bf912744e0c"),
		"file": "/var/log/syslog",
		"date": "Mar 1",
		"time": "21:17:01",
		"host": "chimera",
		"service": "CRON[3660]",
		"message": "(root) CMD ( cd / && run-parts --report /etc/cron.hourly)"
	}];
	returnQuery(dummyLogs);
}

function entriesToLines(theLogs) {
	return ["Here are log entries",
		"One per line",
		"Just as they were uploaded."].join('\n');
}

function analyzeSelected(theLogs) {
	// Return the log stats necessary for
	// the data passed to visualize.jade

	// dummy data the chart.js example bar graph
	var data = {
		labels: ["Feb 3", "Feb 4", "Mar 1", "Mar 6", "Mar 8", "Mar 23"],
		datasets: [
			{
				label: "Feb 16",
				fillColor: "rgba(151,187,205,0.5)",
				strokeColor: "rgba(151,187,205,0.8)",
				highlightFill: "rgba(151,187,205,0.75)",
				highlightStroke: "rgba(151,187,205,1)",
				data: [28, 48, 40, 19, 86, 27]
			}
		]
	};

	return "var data = " + JSON.stringify(data);
}


function doQuery(req, res) {
	//post form
	var query = {
		message: req.body.message,
		service: req.body.service,
		file: req.body.file,
		month: req.body.month,
		day: req.body.day,
		queryType: req.body.queryType
	};

	function returnQuery(theLogs) {
		if (query.queryType === 'visualize') {
			res.render('visualize', {
				title: "Query Visualization",
				theData: analyzeSelected(theLogs)
			});
		} else if (query.queryType === 'show') {
			res.render('show', { title: "Query Results", logs: theLogs });
		} else if (query.queryType === 'download') {
			res.type('text/plain');
			res.send(entriesToLines(theLogs));
		} else {
			res.send("ERROR: Unknown query type.  This should never happen.");
		}
	}

	getLogs(query, returnQuery);
}

function uploadFile(req, res) {

	if (req.file) {
		let theFile = req.file
		inserLog(theFile,database,()=>{
			res.send('success')
		})
	} else {
		res.send('upload failed')
	}

	

}
router.post('/doQuery', doQuery);
router.post('/uploadLog', upload.single('theFile'), uploadFile)

router.get('/testVis', function (req, res) {
	res.render('visualize', {
		title: "Query Visualization Test",
		theData: analyzeSelected()
	});
});

module.exports = router;
