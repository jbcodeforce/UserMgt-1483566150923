/**
 * Test the CRUD operation on User
 */


var test = require('unit.js');
var expect =require('chai').expect;
var userDAO = require('../server/userDAO');
var assert =require('chai').assert;


describe('Create new user', function(){
	describe('#add user',function(){
		it('should add user if does not exist',
		  function(done){
			  var user = {lastName:'Boyer',firstName:'Jerome',password:'passw0rd',email:'boyerje@us.ibm.com',company:'IBM',country:'USA'};
			  userDAO.addUser(user,function(msg,data){
				  console.log(msg);
				  user=data;
					console.log(user);
					assert.equal(msg,'User created');
					assert.isTrue(user.id.length> 10);
					done();
			  	}
				);
		 	});
	});
});
