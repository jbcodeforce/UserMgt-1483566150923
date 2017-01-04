

var cloudant;

module.exports= dbCredentials = {
        "username": "24ad997c-1a52-4f45-9ac2-a13b8382c153-bluemix",
        "password": "95e3b8fa1913a17a1854ffb5998739cf54a75ec345824d0c69df3916c04c2845",
        "host": "24ad997c-1a52-4f45-9ac2-a13b8382c153-bluemix.cloudant.com",
        "port": 443,
        "url": "https://24ad997c-1a52-4f45-9ac2-a13b8382c153-bluemix:95e3b8fa1913a17a1854ffb5998739cf54a75ec345824d0c69df3916c04c2845@24ad997c-1a52-4f45-9ac2-a13b8382c153-bluemix.cloudant.com"
      }


cloudant = require('cloudant')(dbCredentials.url);

module.exports=cloudant;
