'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;
var passport = require('passport');
var flash = require('connect-flash');

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  var drawings = traceur.require(__dirname + '/../routes/drawings.js');

  require('../../config/passport')(passport);
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(flash()); // use connect-flash for flash messages stored in session

  app.all('*', users.lookup);

  app.get('/', dbg, home.index);

  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'public_profile, email' }));
  app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/display',
			failureRedirect : '/'
		}));

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect : '/display',
			failureRedirect : '/'
		}));

  app.post('/login', dbg, users.login);
  app.post('/register', dbg, users.register);
  app.get('/logout', dbg, users.logout);
  app.get('/display', dbg, users.display);
  app.post('/drawings/create', dbg, drawings.create);
  app.get('/drawings/:id', dbg, drawings.show);
  app.get('/users/:id', dbg, users.show);
  app.post('/drawings/:id/delete', drawings.destroy);

  console.log('Routes Loaded');
  fn();
}
