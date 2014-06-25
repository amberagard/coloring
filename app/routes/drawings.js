'use strict';

var traceur = require('traceur');
var Drawing = traceur.require(__dirname + '/../models/drawing.js');
var multiparty = require('multiparty');

exports.show = (req, res)=> {
  Drawing.findById(req.params.id, drawing=>{
    res.render('drawings/show', {drawing:drawing, title:drawing.name, user:req.user});
  });
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();
  var userId = req.user._id;
  form.parse(req, (err, fields, files)=>{
    Drawing.create(userId, fields, files, (drawing)=>{
      res.redirect('/drawings/' + drawing._id);
    });
  });
};
