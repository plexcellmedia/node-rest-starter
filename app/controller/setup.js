var express = require('express');
var router  = express.Router();
var User    = require('../model/user');
var bcrypt  = require('bcrypt-nodejs');

// Create test user
router.get('/setup', function(req, res){

  var user = new User();
  user.firstname = 'John';
  user.lastname  = 'Doe';
  user.username  = 'user';

  var hash = bcrypt.hashSync('pass');
  user.password = hash;

  User.findOne({username:'user'}, '', function(err, usr){
    if(err){
      return res.json({success: false, message: err});
    }
    if(!usr){
      // insert user
      user.save(function(err){
        if(err){
          return res.json({success: false, message: err});
        }
        return res.json({success: true, message: 'User added successfully'});
      });
    }else{
      // user already added
      return res.json({success: false, message: "User with this username already exists"});
    }
  });

});

module.exports = router;