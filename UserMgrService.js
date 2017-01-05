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
var basicAuth = require('basic-auth');

//create a new express server
var app = express();


var User = require('./server/userDAO');

app.use(require('cookie-parser')());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


// Authenticator
var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === '456dfg62de' && user.pass === '1passmelesel0') {
    return next();
  } else {
    return unauthorized(res);
  };
};

//files are looked regarding to the static directory public
app.use(express.static(path.join(__dirname, '/public')));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/home.html'));
});

app.post('/api/register', auth,function(req,res,next){
  User.addUser(req.body,function(user,msg){
    if (msg === "User created") {
        res.status(200).json(user);
    } else {
      res.status(200).json(msg);
    }
  });
});

app.put('/api/password', auth, function(req,res,next){
	res.send(User.updatePassword(req.body,next))
});

app.get('/api/user/:id',auth,function(req,res,next){
  User.getUser(req.params.id,function(data,msg){
    user="User not found";
    if (msg === "User found") {
        user= data;
    }
    res.status(200).json(user);
  });
});

app.get('/api/user/name/:name',auth,function(req,res,next){
  User.findByUsername(req.params.name,function(data,msg){
    user="User not found";
    if (msg === "User found") {
        user=data;
    }
    res.status(200).json(user);
  });
});

app.get('/api/users',auth,function(req,res,next){
  User.getUsers(function(users,msg){
    res.status(200).json(users);
  })
});

app.put('/api/user',auth,function(req,res,next){
  User.updateUser(req.body,function(data,msg){
    user="User not found";
    if (msg === "Updated") {
        user=data;
    }
    res.status(200).json(user);
  })
});

app.get('/hello', function(req, res) {
  res.send('Hello, a toi !');
  }
);

var port=process.env.PORT || 6008
app.listen(port,  function () {
	console.log('User Management v0.0.1 11/10/16 started ready at localhost:'+port);
});
