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
 * User module is used to interact with Cloudant person db.
 *
 * find user by userid or using the entered email address and password.
 *
 */
/**
 * User CRUD Operation
 */

var cloudant = require('./dbcontrol')
var dbname='db_users';
var db = cloudant.use(dbname);
// needed to encrypt password
var bCrypt = require('bcrypt-nodejs');
// use http
var request = require('request');

// internal functions
var _getUser=function(email,next){
	var cloudantquery = {
			"selector": {
				"email": email.trim()
			}}
	db.find(cloudantquery, function(err, data) {
		  console.log(data);
			if (err) {
				console.log(err);
				next({"email":email},"User not found");
			}
		  // keep a copy of the doc so we know its revision token
			if (data.docs.length >0) {
					next(data.docs[0],"User found");
			} else {
					next({"email":email},"User not found");
			}

		});
}; // getUser

var updateUser = function(user,next){
	user.updateDate=new Date().toISOString();
	db.insert(user, function(err, data) {
		if (err) {
			console.log(err);
			next(user,"Not updated")
		}
		next(data,"Updated");
	});
}

var isValidPassword= function(user, password){
	return bCrypt.compareSync(password, user.password);
}

var createHash = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

var updateUserRev= function(user,data){
	user["_id"]=data.id;
	user["_rev"]=data.rev;
	return user;
}

module.exports=  {
		// as the call will be asynchronous, next points to the callback function
		findByUsername: function(email,next){
			var cloudantquery = {
				"selector": {
					"email": {"$eq": email}
				}
			};
			request({
				method: 'POST',
				uri: dbCredentials.url+'/'+dbname+'/_find',
				json: true,
				'auth': {
    			'user': dbCredentials.username,
    			'pass': dbCredentials.password,
    			'sendImmediately': false
  			},
			//	headers :{
			//		"Authorization": "Basic MjRhZDk5N2MtMWE1Mi00ZjQ1LTlhYzItYTEzYjgzODJjMTUzLWJsdWVtaXg6OTVlM2I4ZmExOTEzYTE3YTE4NTRmZmI1OTk4NzM5Y2Y1NGE3NWVjMzQ1ODI0ZDBjNjlkZjM5MTZjMDRjMjg0NQ=="
			//	},
				body: cloudantquery
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					if (body.docs.length > 0) {
						next(body.docs[0],"User found");
					} else {
						next({"email":email},"User not found");
					}
				}else {
					console.log("Retrieved person "+error);
					 next({"email":email},"User not found");
				}
			});
		},
		getUsers : function(next) {
			db.list(function(err,data){
				var docs=[];
				if (err) {
					console.log(err);
					next(docs,'No records');
				} else {
					data.rows.forEach(function(doc) {
						if (!doc.id.includes("_design")) {
							docs.push(doc);
						}
					});
					next(docs,"Records");
				}
			});
		},
		getUser : function(uid,next) {
			console.log("get user:"+uid);
			db.get(uid, function(err, data) {
			    if (err) {
			    	console.log(err);
			    	next({"_id":uid},"User not found");
			    }
			    next(data,"User found");
			  });
		}, // getUser

		userExists: function(email,next){
			_getUser(email,next);
		},

		authenticateUser : function(email,pwd,next) {
		  _getUser(email,function(user,msg) {
				if (msg === "User found") {
					if (isValidPassword(user, pwd)){
						next(user,"Authenticated");
					} else {
						next(user,"Incorrect password");
					}
				} else {
						next({"email":email},"User not found");
				}
			});
		}, // authenticateUser

	/**
	 * update will use rev to update the same record
	 * @param user
	 * @param next
	 */
	 updateUser : function(user,next){
		 updateUser(user,function(data,msg){
			  next(updateUserRev(user,data),msg);
		 });
	 },

	 addUser : function(user,next){
		 console.log("Add user "+user.email);
		 _getUser(user.email,function(_user,msg){
			 if (msg === "User found") {
				  next(_user,'User already exists');
			 } else {
				 user.creationDate=new Date().toISOString();
				 user.password = createHash(user.password);
				 db.insert(user, function(err, data) {
					 if (err) {
						    console.log(err);
								next(user,'User not created due to error');
							}
						// keep a copy of the doc so we know its revision token

							next(updateUserRev(user,data),'User created');
				 });
			}
		  });
	 }, // add user

	 updatePassword : function(user,next){
		 user.password = createHash(user.password);
		 user.cpassword = createHash(user.cpassword);
		 updateUser(user,function(data,msg){
			  next(updateUserRev(user,data),msg);
		 });
	 },
	 deleteUser: function(user,next){
		 if (user && user._id && user._rev) {
			 db.destroy(user._id,user._rev,function(err,data){
				 if (err) {
					 console.log(err);
					 next(user,"Not delete due to error");
				 }
				 next(user,"Deleted");
			 })
		 } else {
			 next(user,"Invalid input");
		 }

	 },
	 isValidPassword: function(user, password) {
		 return isValidPassword(user,password);
	 }

} // exports
