const mongoose = require('mongoose');
const Esp = mongoose.model( "Esp" );

module.exports.getAllEsp = (req, res) => {
    Esp.find()
    .then(esp => {
        res.send(esp);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving esps."
        });
    });
  };

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

module.exports.addEsp = function (wh, date) {
    const esp = new Esp({
      who: wh,
      subscribeDate: date
    });
    try{
        esp.save();
    }
    catch(e){
        console.log(e);
    }
  };

module.exports.getEspById = (req, res) => {
    Esp.findOne(
        {_id:req.params.id})
    .then(esp => {
        if(!esp) {
            return res.status(404).send({
                message: "Esp not found with id " + req.params.id
            });            
        }
        res.send(esp);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Esp not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving esp with id " + req.params.id
        });
    });
};

module.exports.getEspByMac = function(wh) {
    return Esp.findOne({who:wh});
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
