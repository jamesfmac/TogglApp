var Router = require('express').Router();
var ensureAuthenticated = require('../Models/users.js');
var path = require('path');
var usersController = require('../controllers/users.js');



Router.get('/testapi', function(req, res) {
    res.status(200).json({
        message: 'Connected!'
    });
});

//this will probably be removed and replaced with the route, controller, model options below
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


//returns the full userprofile for all users
Router.get('/users', usersController.getAllUsers);

//returns the full userprofile for a passed in user ID
Router.get('/users:id', usersController.getUserDetail);

//returns the full userprofile for a passed in user ID
Router.put('/users:id', usersController.getUserDetail);


//return the full details for the current user based on req.user.id from the logged in users session
Router.get('/currentuser', usersController.getCurrentUser);
Router.post('/currentuser', usersController.updateCurrentUser);





module.exports = Router;