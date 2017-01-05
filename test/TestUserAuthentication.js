/**
 * Test the CRUD operation on User
 */


var test = require('unit.js');
var userDAO = require('../server/userDAO');
var assert =require('chai').assert;


	describe('User good password', function(){
			it('should be authenticated ',
			  function(done){
					userDAO.authenticateUser('boyerje@us.ibm.com','passw0rd',function(data,msg){
						console.log(data+" "+msg);
						assert.equal("Authenticated",msg);
						done();
					});
				}
		   );
	});

	describe('User wrong password', function(){
			it('should be authenticated ',
			  function(done){
					userDAO.authenticateUser('boyerje@us.ibm.com','ehmerde',function(data,msg){
						console.log(data+" "+msg);
						assert.equal("Incorrect password",msg);
						done();
					});
				}
		   );
	});
