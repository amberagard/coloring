// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '457761707702272', // your App ID
		'clientSecret' 	: 'd3b2bcaa38e723cbbb7bcfba9a52d018', // your App Secret
		'callbackURL' 	: 'http://localhost:4000/auth/facebook/callback'
	},

	// 'twitterAuth' : {
	// 	'consumerKey' 		: 'your-consumer-key-here',
	// 	'consumerSecret' 	: 'your-client-secret-here',
	// 	'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	// },
};
