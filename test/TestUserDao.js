/**
 * Test the CRUD operation on User
 */


var expect =require('chai').expect;
var userDAO = require('../server/userDAO');
var user=userDAO.getUser('boyerje@us.ibm.com',function(data){
		expect(data.lname).to.equal('Boyer');
		return data;}
	)
