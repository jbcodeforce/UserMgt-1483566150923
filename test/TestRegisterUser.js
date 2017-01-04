/**
 * Test the CRUD operation on User
 */


var test = require('unit.js');
var expect =require('chai').expect;
var userDAO = require('../server/userDAO');


describe('Verify User DAO get user', function(){
	it('get existing user',function(done){
		 userDAO.getUser('boyerje@us.ibm.com',function(data){

				var user=data;
				test.object(user);
				expect(user.lname).to.equal('Boyer');
				done();
			}
		);

	});
});

describe('Verify User DAO update user', function(){
	var user;
	beforeEach(function(done){
		userDAO.getUser('boyerje@us.ibm.com',function(data){
			user=data;

			done();
		  })
	});
	it('update user',function(done){
		user.city='Santa Clara';
		userDAO.updateUser(user,function(data) {
			test.object(data);
			//expect(data.rev).to.not.be.empty();
			done();
			}
		);
	});
});

describe('Create new user', function(){
	it('add user',function(done){
		var user = {name:'bill',email:'bill@ibm.com',company:'IBM'}
		userDAO.addUser(user,function(data){
			user=data;
			console.log(user);
			done();
		  })
	});

});

describe('Delete the new user ', function(){
	var user;
	beforeEach(function(done){
		userDAO.getUser('bill@ibm.com',function(data){
			user=data;
			done();
		  })
	});
	it('delete user',function(done){
		if (user) {
			userDAO.deleteUser(user,function(data){
				done();
			})
		}
	});
});
