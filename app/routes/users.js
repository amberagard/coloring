'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.register = (req, res)=> {
  User.register(req.body, u=> {
    if(u) {
      req.session.userId = u._id;
      res.redirect('/display');
    } else {
      req.session.userId = null;
      res.redirect('/');
    }
  });
};

exports.display = (req, res)=> {
  console.log('********');
  console.log(req.isAuthenticated());
  console.log(req.user);
  res.render('users/display', {user: req.user, title: 'Let\'s Color!'});
};

exports.lookup = (req, res, next)=> {
  User.findById(req.session.userId, u=>{
    res.locals.user = u;
    next();
  });
};

exports.login = (req, res, next)=> {
  User.login(req.body, u=> {
    if(u) {
      req.session.userId = u._id;
      res.redirect('/display');
    } else {
      req.session.userId = null;
      res.redirect('/');
    }
  });
};

exports.logout = (req, res)=> {
  req.logout();
  //req.session.userId = null;
  res.redirect('/');
};
