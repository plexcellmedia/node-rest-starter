var express = require('express');
var router  = express.Router();
var config  = require('../../config');
var jwt     = require('jsonwebtoken');
var User    = require('../model/user');
var bcrypt  = require('bcrypt-nodejs');

// Authenticate user
router.post('/authenticate', function(req, res){
  // Validation
  req.checkBody({
    'username': {
      notEmpty: true,
      errorMessage: 'Username missing'
    },
    'password': {
      notEmpty: true,
      errorMessage: 'Password missing'
    }
  });

  // Check validation
  var errors = req.validationErrors();
  if(errors){
    // Get first error message
    var message = errors[0].msg;
    return res.json({ success: false, message: message });
  }

  User.findOne({username: req.body.username}, '', function(err, user){
    if(err){
      return res.json({success: false, message: err});
    }
    if(!user){
      // Invalid username
      return res.json({success: false, message: "Invalid username or password"});
    }else{
      // Does passwords match?
      if(bcrypt.compareSync(req.body.password, user.password)){
        // Authenticate user
        var token = jwt.sign(user, config.secret, {
            expiresIn: 1440 // token valid for 24h
        });
        return res.json({success: true, message: 'Authenticated successfully', token: token});
      }else{
        // Invalid password
        return res.json({success: false, message: "Invalid username or password"});
      }
    }
  });
});

// Get all users
router.get('/users', function(req, res){
  User.find({}, '_id firstname lastname username', function(err, users) {
    if (err) {
      return res.json({success: false, message: err});
    }
    return res.json(users);
  });
});

// Get user by id
router.get('/user/:id', function(req, res){
  User.findById(req.params.id, '_id firstname lastname username', function(err, user) {
    if (err) {
      return res.json({success: false, message: err});
    }
    return res.json(user);
  });
});

// Add user
router.post('/user', function(req, res){
  // Validation
  req.checkBody({
    'firstname': {
      notEmpty: true,
      errorMessage: 'First name missing'
    },
    'lastname': {
      notEmpty: true,
      errorMessage: 'Last name missing'
    },
    'username': {
      notEmpty: true,
      errorMessage: 'Username missing'
    },
    'password': {
      notEmpty: true,
      errorMessage: 'Password missing'
    }
  });

  // Check validation
  var errors = req.validationErrors();
  if(errors){
    // Get first error message
    var message = errors[0].msg;
    return res.json({ success: false, message: message });
  }

  User.findOne({username: req.body.username}, '', function(err, usr){
    if(err){
      return res.json({success: false, message: err});
    }
    if(!usr){
      // insert user
      var user = new User();
      user.firstname = req.body.firstname;
      user.lastname  = req.body.lastname;
      user.username  = req.body.username;

      var hash = bcrypt.hashSync(req.body.password);
      user.password = hash;

      user.save(function(err){
        if(err){
          return res.json({success: false, message: err});
        }
        return res.json({success: true, message: 'User added successfully'});
      });
    }else{
      // user already exists
      return res.json({success: false, message: "User with this username already exists"});
    }
  });

});

// Update user id
router.put('/user/:id', function(req, res){
  // Validation
  req.checkBody({
    'firstname': {
      notEmpty: true,
      errorMessage: 'First name missing'
    },
    'lastname': {
      notEmpty: true,
      errorMessage: 'Last name missing'
    },
    'username': {
      notEmpty: true,
      errorMessage: 'Username missing'
    },
    'password': {
      notEmpty: true,
      errorMessage: 'Password missing'
    }
  });

  // Check validation
  var errors = req.validationErrors();
  if(errors){
    // Get first error message
    var message = errors[0].msg;
    return res.json({ success: false, message: message });
  }

  User.findById(req.params.id, function(err, user) {
    if (err) {
      return res.json({success: false, message: err});
    }
    if(user){
      // Update user details
      user.firstname = req.body.firstname;
      user.lastname  = req.body.lastname;
      user.username  = req.body.username;

      var hash = bcrypt.hashSync(req.body.password);
      user.password = hash;

      // Save user
      user.save(function(err){
        if(err){
          return res.json({success: false, message: err});
        }
        return res.json({success: true, message: 'User saved successfully'});
      });
    }
  });
});

// Delete user by id
router.delete('/user/:id', function(req, res){
  User.remove({ _id: req.params.id }, function(err){
    if(err){
      return res.json({success: false, message: err});
    }
    return res.json({success: true, message: 'User deleted'});
  });
});

module.exports = router;