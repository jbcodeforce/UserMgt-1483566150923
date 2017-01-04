/**
 * Test the CRUD operation on User
 */


var test = require('unit.js');
var expect =require('chai').expect;
var userDAO = require('../server/userDAO');
var assert =require('chai').assert;


describe('Verify user exist', function(){
		it('should not be present',
		  function(done){
				var b=userDAO.getUser('boyerje@us.email.com',function(err,data){
					console.log(data);
					return data;
				});
				console.log(b);
				assert.isUndefined(b);
				done();
			}
	   );
});
