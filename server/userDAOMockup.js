/**
 * User CRUD Operation
 */



user={'email':'dede','name':'dede'}

module.exports=  {
		// as the call will be asynchronous, next points to the callback function
		getUser : function(email,next) {
			user={'email':email,'name':'dede'}
			next(user)
		}, // getUser
		
		authenticateUser : function(email,pwd,next) {
			return next(null,user);
		}, // authenticateUser

	/**
	 * update will use rev to update the record
	 * @param user
	 * @param next
	 */
	 updateUser : function(user,next){
		 next(user);
	 },
	 updatePassword : function(user,next){
		 next(user);
	 },
	 addUser : function(user,next){
		next(user) 
	 },
	 deleteUser: function(user,next){
		 
	 },
	 isValidPassword: function(user, password) {
		 return true;
	 }
} // exports