'use strict';

var traceur = require('traceur');
var Drawing = traceur.require(__dirname + '/../models/drawing.js');
var multiparty = require('multiparty');

exports.show = (req, res)=> {
  Drawing.findById(req.params.id, drawing=>{
    res.render('drawings/show', {drawing:drawing, title:drawing.name});
  });
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();
  form.parse(req, (err, fields, files)=>{
    Drawing.create(fields, files, (drawing)=>{
      res.redirect('/drawings/' + drawing._id);
    });
  });
};

// exports.index = (req, res)=>{
//   Drawing.findByUserId(req.params.id, drawings=>{
//     console.log(req.params.id);
//     console.log('^^^^^^');
//     console.log(drawings);
//     res.render('users/show/'+ req.params.id, {drawings:drawings});
//   });
// };
