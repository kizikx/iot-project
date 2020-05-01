const path = require('path');
const mqtt = require('mqtt')

const TOPIC_LIGHT = 'luciolesbleues/sensors/light'
const TOPIC_TEMP  = 'luciolesbleues/sensors/temp'
const TOPIC_WIFI  = 'luciolesbleues/wifi'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const Temp = require('./models/TempModel')
const Light = require('./models/LightModel')
const Wifi = require('./models/WifiModel')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/')));
app.use(function(request, response, next) { 
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "*");
    response.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
});
                 
const mongoUrl = 'mongodb+srv://admin:G3Z4hkpUnyKjvK5U@cluster0-vptbp.mongodb.net/lucioles?retryWrites=true&w=majority';
const mongoose = require('mongoose')

mongoose.connect(mongoUrl, {useUnifiedTopology: true, useNewUrlParser: true})
.then(() => {
  console.log("Successfully connected to the database");  
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});

const mqtt_url = 'http://broker.hivemq.com'
let client_mqtt = mqtt.connect(mqtt_url);

app.get('/', function(req, res, next){
	req.client_mqtt = client_mqtt;
	next();
});


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
	
	let topicname = path.parse(topic.toString()).base;
	switch (topicname){
		case 'temp':
			new_entry = new Temp();
			break;
		case 'light':
			new_entry = new Light();
			break;
		case 'wifi':
			new_entry = new Wifi();
			break;
	}
	new_entry.date=frTime;
	new_entry.who=wh;
	new_entry.value=val;

	try{
		new_entry.save();
	}
	catch(e){
		console.log(e);
	}

}) 

app.get('/', function (req, res) {
res.sendFile(path.join(__dirname + '/ui_lucioles.html'));
});

require('./route/route') (app);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server listening on port 3000');
});
