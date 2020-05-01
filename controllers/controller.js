const mongoose = require('mongoose');

module.exports.publishPing = async(req, res) => {
    client_mqtt = req.client_mqtt;
	who = req.params.who;

	client_mqtt.publish('luciolesbleues/ping', JSON.stringify({
		who,
	}));

	res.status(200);
	res.json({
		message: 'ok',
	});
    console.log('end app.get');
};

module.exports.getTopic = (req, res) => {
wa = req.params.what ;
let tempCollection;

switch (wa){
    case 'temp':
        tempCollection = mongoose.model( "Temp" );
        break;
    case 'light':
        tempCollection = mongoose.model( "Light" );
        break;
    case 'wifi':
        tempCollection = mongoose.model( "Wifi" );
        break;
}

tempCollection.find()
    .then(items => {
        res.send(items);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving items."
        });
    });
};
