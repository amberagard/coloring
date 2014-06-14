// config/passport.js

// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../app/models/user.js');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {

	// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
      done(null, user._id.toString());
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
      console.log('--------');
      console.log(id);
      User.findById(id, function(err, user) {
        if(user) {
          return done(err, user);
        }
        done(null, false);
      });
    });

	// code for login (use('local-login', new LocalStategy))
	// code for signup (use('local-signup', new LocalStategy))

	// =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

		// pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

		// asynchronous
		process.nextTick(function() {

			// find the user in the database based on their facebook id
	        User.findByFacebookId(profile.id, function(err, user) {

	        	// if there is an error, stop everything and return that
	        	// ie an error connecting to the database
	            if (err) {
	              return done(err);
              }

				// if the user is found, then log them in
	            if (user) {
	              return done(null, user); // user found, return that user
	            } else {
	                // if there is no user found with that facebook id, create them
	                var newUser            = new User();

					// set all of the facebook information in our user model
	                newUser.facebook       = {};
                  newUser.facebookId     = profile.id;
	                newUser.facebook.token = token; // we will save the token that facebook provides to the user
	                newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
	                newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                  newUser.facebook.profile = profile;

					// save our user to the database
	                newUser.save(function(err) {
	                    if (err)
	                        throw err;

	                    // if successful, return the new user
	                    return done(null, newUser);
	                });
	            }

	        });
        });

    }));

};