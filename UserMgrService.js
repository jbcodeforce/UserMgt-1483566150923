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
 * Author Jerome Boyer Nov 2016
 */
/**
 * User management microservice
*/
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

//create a new express server
var app = express();


var User = require('./server/userDAOMockup');

app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//files are looked regarding to the static directory public
app.use(express.static(path.join(__dirname, '/public')));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/home.html'));
});

app.post('/api/register', function(req,res,next){
	res.send(User.addUser(req.body,next))
});
app.put('/api/password', function(req,res,next){
	res.send(User.updatePassword(req.body,next))
});

app.get('/api/user',function(req,res,next){
	res.send(User.getUser(req.body,next))
});

app.put('/api/user',function(req,res,next){
	res.send(User.updateUser(req.body,next))
});

/**
 * TODO

app('api/user',function(req,res,next){
	res.send(User.deleteUser(req.body,next))
});
*/
app.listen("6008",  function () {
	console.log('User Management v0.0.1 11/10/16 started ready at localhost:6008');
});
