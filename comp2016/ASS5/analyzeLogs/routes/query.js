const db_name = 'assFive'
const db_collection = 'logFile'
let database

const mc = require('mongodb').MongoClient

mc.connect('mongodb://localhost:27017', (err, client) => {
    if (err) throw err
    database = client.db(db_name).collection(db_collection)
    console.log('connect to database');

    search(query, database)

})
/* return 
"_id": ObjectId("56d66dffec898bf912744e0a"),
		"file": "/var/log/syslog",
		"date": "Mar 1",
		"time": "19:40:28",
		"host": "chimera",
		"service": "org.gnome.evolution.dataserver.Sources4[1753]",
		"message": "** (evolution-source-registry:2004): WARNING **: secret_service_search_sync: must specify at least one attribute to match"
	},
*/
function search(query, database) {
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
    //    console.log(query);

    database.find({
        // $or: [
        //     { filename: { $regex: `${query.file}`, $options: 'i' } },
            // {
                data:
                {
                    $in:[
                    {
                    //     $or: [
                        
                             date:  `${query.month} ${query.day}`,
                            //  message: { $regex: `${query.message}`, $options: 'i' } ,
                            //  service: { $regex: `${query.service}`, $options: 'i' } ,
                    //     ]
                    }
                ]

                }

            // }

        // ]
    }).toArray((err, data) => {
        console.log(JSON.stringify(data));

    })
    // database.find().toArray((err,data)=>{
    //     console.log(data);

    // })

}
var query = {
    // 'file': 'syslog.2',
    // 'service': 'systemd',
    'month': 'Mar',
    'day':'9'
}



