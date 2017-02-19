var Router = require('express').Router();
var ensureAuthenticated = require('../Models/users.js');
var path = require('path');


Router.get('/testapi', function(req, res) {
  res.status(200).json({ message: 'Connected!' });
});

Router.get('/userprofile',

    function(req, res) {    
        console.log('api/userprofile is right now being hit');
        if (req.user) {
            console.log('user profile returned is ' + (req.user));
            return res.json(req.user);

        }
        // mocking out user for development. Mock user defined in users model
        else if (process.env.NODE_ENV == 'development') {
            return res.json(Users.mock);

        } else {
            return res.json('no logged in user');
        }

    });


module.exports = Router;
