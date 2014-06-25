'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Drawing = traceur.require(__dirname + '/../models/drawing.js');

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

exports.show = (req, res)=> {
  User.findById(req.params.id, artist=>{
    Drawing.findByUserId(req.params.id, drawings=>{
      res.render('users/show', {user:req.user, artist:artist, drawings:drawings, title: 'My Coloring Book'});
    });
  });
};

exports.display = (req, res)=> {
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
  res.redirect('/');
};
