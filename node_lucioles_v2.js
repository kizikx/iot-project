const path = require('path');
const mqtt = require('mqtt')

const TOPIC_LIGHT = 'luciolesbleues/sensors/light'
const TOPIC_TEMP  = 'luciolesbleues/sensors/temp'
const TOPIC_WIFI  = 'luciolesbleues/wifi'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/')));
app.use(function(request, response, next) { 
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "*");
    response.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
});

const mongoBaseName = "lucioles"                   
const uri = 'mongodb+srv://heroku:if\@9FyQ8GtR6pm@iot-goltu.mongodb.net/lucioles?retryWrites=true&w=majority';

const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(function(err,  mongodbClient){
    if(err) throw err; 

    let dbo = client.db(mongoBaseName);

    const mqtt_url = 'http://broker.hivemq.com'
    let client_mqtt = mqtt.connect(mqtt_url);
    
    client_mqtt.on('connect', function () {
	client_mqtt.subscribe(TOPIC_LIGHT, function (err) {
	    if (!err) {
		console.log('Node Server has subscribed to ', TOPIC_LIGHT);
	    }
	})
	client_mqtt.subscribe(TOPIC_TEMP, function (err) {
	    if (!err) {
		console.log('Node Server has subscribed to ', TOPIC_TEMP);
	    }
	})
	client_mqtt.subscribe(TOPIC_WIFI, function (err) {
	    if (!err) {
		console.log('Node Server has subscribed to ', TOPIC_WIFI);
	    }
	})
    })


    client_mqtt.on('message', function (topic, message) {
		console.log("MQTT msg on topic : ", topic.toString());
		console.log("Msg payload : ", message.toString());

		message = JSON.parse(message);
		wh = message.who
		val = message.value

		let wholist = []
		let index = wholist.findIndex(x => x.who==wh)
		if (index === -1){
			wholist.push({who:wh});	    
		}
		console.log("wholist using the node server :", wholist);
		

		let frTime = new Date().toLocaleString("sv-SE", {timeZone: "Europe/Paris"});
		let new_entry = { date: frTime, 
				who: wh,     
				value: val    
				};
		
		let topicname = path.parse(topic.toString()).base;

		key = topicname
		dbo.collection(key).insertOne(new_entry, function(err, res) {
			if (err) throw err;
			console.log("Item inserted in db in collection :", key);
			console.log(new_entry);
		});

    }) 

    process.on('exit', (code) => {
	if (mongodbClient && mongodbClient.isConnected()) {
	    console.log('mongodb connection is going to be closed ! ');
            mongodbClient.close();
	}
    })
    
    app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/ui_lucioles.html'));
	});
	
	app.get('/esp/ping/:who', function(req, res) {
        who = req.params.who;

        client_mqtt.publish('luciolesbleues/ping', JSON.stringify({
            who,
        }));

        res.status(200);
        res.json({
            message: 'ok',
        });
    });

    app.get('/esp/:what', function (req, res) {
	console.log(req.originalUrl);
	
	wh = req.query.who 
	wa = req.params.what 

	console.log("\n--------------------------------");
	console.log("A client/navigator ", req.ip);
        console.log("sending URL ",  req.originalUrl);
	console.log("wants to GET ", wa);
	console.log("values from object ", wh);
	
	const nb = 200; 
	
	key = wa
	dbo.collection(key).find({who:wh}).sort({_id:-1}).limit(nb).toArray(function(err, result) {
	    if (err) throw err;
	    console.log('get on ', key);
		res.json(result.reverse()); 
	    console.log('end find');
	});
	console.log('end app.get');
    });

});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server listening on port 3000');
});
