require('../models/UserModel');

const mongoose = require('mongoose');
const User = mongoose.model( "User" );
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                          { userId: user._id },
                          'RANDOM_TOKEN_SECRET',
                          { expiresIn: '24h' }
                        )
                      });
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

module.exports.logout = (req, res) => {
};

module.exports.updatePassword = (req, res) => {
};