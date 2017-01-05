/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This express script defines the REST services and the authentication mechanism.
 * We use passport for authentication management with local strategy: so users
 * are define in cloudant db and their credentials are validated with login page
 */
'use strict';

var User = require('./users');

//Create a new Express application.
var express = require('express');
var router = express.Router();

var path =require('path');
var session = require('express-session');
var bodyParser = require('body-parser');


module.exports = function (app) {
	// router.use(bodyParser.urlencoded({ extended: true }));
	// router.use(bodyParser.json());

	function ensureAuthenticated(req, res, next) {
		console.log('Enter EnsureAuthenticated');
		if(!req.isAuthenticated()) {
			console.log("Go to user login");
		    req.session.originalUrl = req.originalUrl;
			res.redirect('/');
		} else {
			console.log("User logged is "+req.user['email']);
			return next();
		}
	}

	//files are looked regarding to the static directory public
	app.use(express.static(path.join(__dirname, '/../public')));

	app.use(require('cookie-parser')());
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(session({resave: 'true', saveUninitialized: 'true' , secret: 'keyboard cat', cookie:{secure: false}}));
	app.use(passport.initialize());
	// persist login information in http session
	app.use(passport.session());

	// Define routes
	// --------------------------------------------------
	// angular single page
	app.get('/',  ensureAuthenticated,function(req, res) {
		console.log(res);
	     res.sendFile(__dirname+ '../public/index.html');
	});

	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	app.get('/api/user', ensureAuthenticated,function(req, res) {
		console.log(req.user['email']);
		res.send({user: {email : req.user['email'], fname : req.user['fname'], lname : req.user['lname']}});
	});

	app.post('/login', function(req, res, next) {
		console.log(req.body);
		passport.authenticate('local', function(user, err, info) {
			if (err) {
				if (err == 'NO_USER_FOUND' || err == 'INCORRECT_PASSWORD')
					return res.send({ success : false, message : err });
				return next(err); // will generate a 500 error
			}
			// Generate a JSON response reflecting authentication status
			if (! user) {
				return res.send({ success : false, message : 'NO_USER_FOUND' });
			}
			// ***********************************************************************
			// "Note that when using a custom callback, it becomes the application's
			// responsibility to establish a session (by calling req.login()) and send
			// a response."
			// Source: http://passportjs.org/docs
			// ***********************************************************************
			req.login(user, function(err) {
				if (err) res.send({ success : false, message : 'authentication Failed' + err });
				return res.send({ success : true, message : 'authentication succeeded', user : {email : user.email, fname : user.fname, lname : user.lname}});
			});
		})(req, res, next);
	});

    app.post('/api/register', function(req,res){
    	res.send(User.register(req.body))
    });

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.post('/update/password', function(req,res) {
		User.updatePassword(req.body, function(err){
			if (err) {
				console.log(err);
				res.send(err);
			} else {
				res.send("UPDATE_PASSWORD_SUCCESSFUL");
			}
		})
	});


    app.get('/hello', ensureAuthenticated, function(req, res) {
	    res.send('Hello, '+ req.user['id'] + '!');
	    }
    );

	app.get('/failure', function(req, res) {
	    res.send('Login failed');
	    }
	)
}
