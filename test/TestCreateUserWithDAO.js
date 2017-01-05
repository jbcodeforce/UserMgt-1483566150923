/**
 * Test the CRUD operation on User
 */


var test = require('unit.js');
var expect =require('chai').expect;
var userDAO = require('../server/userDAO');
var assert =require('chai').assert;


describe('Create new user', function(){
	describe('#add user',function(){
		it('should not add user as it exists',
		  function(done){
			  var user = {lastName:'Boyer',firstName:'Jerome',password:'passw0rd',email:'boyerje@us.ibm.com',company:'IBM',country:'USA'};
			  userDAO.addUser(user,function(data,msg){
				  console.log(data);
					assert.equal(msg,'User already exists');
					assert.isTrue(data._id.length> 10);
					done();
			  	}
				);
		 	});
	});
});


describe('Create new user', function(){
	it('add user',function(done){
		var user = {name:'bill',email:'bill@ibm.com',company:'IBM'}
		userDAO.addUser(user,function(user,msg){
			console.log(user);
			assert.equal("User created",msg);
		  })
		userDAO.getUsers(function(data,msg){
			console.log(data);
			done();
		});
	});
});

describe('Delete the new user ', function(){
	var user;
	beforeEach(function(done){
		userDAO.findByUsername('bill@ibm.com',function(data,msg){
			user=data;
			done();
		  })
	});
	it('delete user',function(done){
		if (user) {
			userDAO.deleteUser(user,function(data,msg){
				assert.equal("Deleted",msg);
				done();
			})
		}
	});
});
