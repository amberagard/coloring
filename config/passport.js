// config/passport.js

// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;

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

    passport.use(new FacebookStrategy({

        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL

    },

    function(token, refreshToken, profile, done) {

		process.nextTick(function() {

	        User.findByFacebookId(profile.id, function(err, user) {

	            if (err) {
	              return done(err);
              }

	            if (user) {
	              return done(null, user); // user found, return that user
	            } else {
	                // if there is no user found with that facebook id, create them
	                var newUser            = new User();

	                newUser.facebook       = {};
                  newUser.facebookId     = profile.id;
	                newUser.facebook.token = token; // we will save the token that facebook provides to the user
	                newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
	                newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                  newUser.facebook.profile = profile;

	                newUser.save(function(err) {
	                    if (err)
	                        throw err;

	                    return done(null, newUser);
	                });
	            }

	        });
        });

    }));

    passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL

    },
    function(token, tokenSecret, profile, done) {

    	process.nextTick(function() {

	        User.findByTwitterId(profile.id, function(err, user) {

	            if (err)
	                return done(err);

	            if (user) {
	                return done(null, user); // user found, return that user
	            } else {
	                var newUser                 = new User();

                  newUser.twitter             = {};
	                newUser.twitterId           = profile.id;
	                newUser.twitter.token       = token;
	                newUser.twitter.username    = profile.username;
	                newUser.twitter.displayName = profile.displayName;

	                newUser.save(function(err) {
	                    if (err)
	                        throw err;
	                    return done(null, newUser);
	                });
	            }
	        });

	});

    }));

};
