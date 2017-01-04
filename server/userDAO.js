/**
 * User CRUD Operation
 */

cloudant = require('./dbcontrol')
db = cloudant.use('db_users');
// needed to encrypt password
var bCrypt = require('bcrypt-nodejs');

// internal functions
var _getUser=function(email,next){
	var cloudantquery = {
			"selector": {
				"email": email.trim()
			}}
	db.find(cloudantquery, function(err, data) {
			if (err) {
				console.log(err);
				next({})
			}
		// keep a copy of the doc so we know its revision token
			next(data.docs[0]);
		});
}; // getUser

var updateUser = function(user){
	user.updateDate=new Date().toISOString();
	db.insert(user, function(err, data) {
		if (err) {
			console.log(err);
			return {};
		}
		return data;
	});
}

var isValidPassword= function(user, password){
	return bCrypt.compareSync(password, user.password);
}

var createHash = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports=  {
		// as the call will be asynchronous, next points to the callback function
		getUser : function(email,next) {
			console.log(email);
			var cloudantquery = {
				"selector": {
    			"email": {
      			"$eq": email.trim()
					}}
			};
			db.find(cloudantquery, function(err, data) {
					console.log("find:"+data);
			    if (err) {
			    	console.log(err);
			    	next({})
			    }
				// keep a copy of the doc so we know its revision token
			    next(data.docs[0]);
			  });
		}, // getUser

		userExists: function(email,next){
			return _getUser(email,next);
		},

		authenticateUser : function(email,pwd,next) {
			var cloudantquery = {
					"selector": {
						"email": email
					}}
			db.find(cloudantquery, function(err, data) {
			    if (err) {
			    	console.log(err);
			    	next('NO USER FOUND',null)
			    }
			    if (data.docs.length > 0 && isValidPassword(data.docs[0], pwd)) {
					return next(null,data.docs[0]);

				} else if (data.docs.length == 0) {
					next('NO USER FOUND',null)
				}
				else{
					return next('INCORRECT PASSWORD',null);
				}
			  });
		}, // authenticateUser

	/**
	 * update will use rev to update the same record
	 * @param user
	 * @param next
	 */
	 updateUser : function(user,next){
		 data=updateUser(user);
		 next(data);
	 },

	 addUser : function(user,next){
		 console.log("Add user "+user.email);
		 var _user = _getUser(user.email);
		 if (_user){
			 next('User exists',_user);
		 } else {
			 user.creationDate=new Date().toISOString();
			 user.password = createHash(user.password);
			 db.insert(user, function(err, data) {
				 if (err) {
				    	next('User not created due to error',err)
				    }
					// keep a copy of the doc so we know its revision token
				    next('User created',data);
			});
		 }
	 }, // add user

	 updatePassword : function(user,next){
		 user.password = createHash(user.password);
		 user.cpassword = createHash(user.cpassword);
		 data=updateUser(user);
		 next(data);
	 },
	 deleteUser: function(user,next){
		 db.destroy(user._id,user._rev,function(err,data){
			 if (err) {
				 console.log(err);
				 next({})
			 }
			 next({})
		 })
	 },
	 isValidPassword: function(user, password) {
		 return isValidPassword(user,password);
	 }

} // exports
