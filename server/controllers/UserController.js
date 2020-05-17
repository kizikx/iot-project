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
                        administrator: user.administrator,
                        token: jwt.sign(
                          { userId: user._id, administrator: user.administrator},
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
    if (!req.body) {
        return res.status(400).send({
            message: "User content can not be empty"
        })
    }
  
    User.findOne({username: req.params.username}, (err, foundObject) => {
      if (req.body.password !== undefined) {
            const saltRounds = 10;
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
              foundObject.password = req.body.password;
              foundObject.save((err, updatedObject) => {
                if (err) {
                    res.status(400).send({
                        erreur: err.message
                    })
                } else {
                    res.status(200).send(updatedObject)
                }
              })
            })
      }
    });
};

module.exports.updateRole = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "User content can not be empty"
        })
    }
  
    User.findOne({username: req.params.username}, (err, foundObject) => {
      if (req.body.administrator !== undefined) {
        foundObject.administrator = req.body.administrator;
      }

      foundObject.save((err, updatedObject) => {
          if (err) {
              res.status(400).send({
                  erreur: err.message
              })
          } else {
              res.status(200).send(updatedObject)
          }
      })
    })
};

module.exports.deleteUser = (req, res) => {
    User.findOneAndDelete({username:req.params.username})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.username
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Username not found with username " + req.params.username
            });                
        }
        return res.status(500).send({
            message: "Could not delete username with username " + req.params.username
        });
    });
};