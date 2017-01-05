/**
 * Test the CRUD operation on User
 */


var test = require('unit.js');
var expect =require('chai').expect;
var userDAO = require('../server/userDAO');
var assert =require('chai').assert;


describe('Verify user exists using findByUsername', function(){
		it('should be present',
		  function(done){
				userDAO.findByUsername('boyerje@us.ibm.com',function(data,msg){
					console.log(data+" "+msg);
					assert.equal("User found",msg);
					done();
				});
			}
	   );
});

describe('Verify findByUsername', function(){
		it('should not be present',
		  function(done){
				userDAO.findByUsername('boyerje2@us.ibm.com',function(data,msg){
					console.log(data+" "+msg);
					assert.equal("User not found",msg);
					done();
				});
			}
	   );
});

describe('Verify get user ', function(){
		it('should be present',
		  function(done){
				userDAO.getUser('c5c9354876c130f87362daf32c57fd7c',function(data,msg){
					console.log(JSON.stringify(data)+" "+msg);
					assert.equal("User found",msg);
					done();
				});
			}
	   );
});

describe('Verify get user wrong id', function(){
		it('should not be present',
		  function(done){
				userDAO.getUser('6f7b4e',function(data,msg){
					console.log(JSON.stringify(data)+" "+msg);
					assert.equal("User not found",msg);
					done();
				});
			}
	   );
});

describe('Verify user exist wrong email', function(){
		it('should not be present',
		  function(done){
				userDAO.userExists('boyerje2@us.ibm.com',function(data,msg){
					console.log(JSON.stringify(data)+" "+msg);
					assert.equal("User not found",msg);
					done();
				});
			}
	   );
});
