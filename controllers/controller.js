require('../models/UserModel');

const mongoose = require('mongoose');
const User = mongoose.model( "User" );
const bcrypt = require('bcrypt');

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

module.exports.addUser = (req, res) => {
    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        let user = new User({
            username : req.body.username,
            password : hash
        });
        user.save((err)=>{
            if(err){
            res.send(err.message)
            } else
            res.send('Users credentials added successfully!');
        })
    });

};

module.exports.login = (req, res) => {
    User.findOne(
           {username:req.body.username})
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "User not found with username " + req.body.username
                });            
            }
            else{
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if(result===true){
                    res.status(200).send('connected');
                }
                else{
                    return res.status(401).send({
                        message: "Wrong password with username: " + req.body.username
                    });   
                }
            });
            }
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with username " + req.bodyusername
                });                
            }
            return res.status(500).send({
                message: "Error retrieving user with username " + req.body.username
            });
        });
};