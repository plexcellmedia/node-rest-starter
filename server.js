var express          = require('express');
var expressValidator = require('express-validator');
var app              = express();
var bodyParser       = require('body-parser');
var cookieParser     = require('cookie-parser');
var cors             = require('cors')
var session          = require('express-session');
var jwt              = require('jsonwebtoken');
var config           = require('./config');
var port             = process.env.PORT || 8080;
var router           = express.Router();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser());
app.use(session({ secret: config.secret }));

var mongoose   = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb);

var middlewares = {
  isAuth: function(req, res, next){
    // Skip protected route if requesting token
    if(req.url == '/api/authenticate'){
      next();
    }else{
      var token = req.body.token || req.query.token || req.headers['x-access-token'];
      if(token){
        jwt.verify(token, config.secret, function(err, user) {
          if (err) {
            return res.json({success: false, message: 'Authentication failed.'});
          }else{
            req.user = user;
            next();
          }
        });
      }else{
        return res.json({success: false, message: 'Authentication token missing.'});
      }
    }
  }
}


// Setup route to create test user
var setup = require('./app/controller/setup');
router.use('/', setup);

// API routes
var api = require('./app/controller/api');

router.all('/api/*', middlewares.isAuth);
router.use('/api', api);

// set app to user router
app.use('/', router);

// Start server
app.listen(port);

console.log('Listening port ' + port);