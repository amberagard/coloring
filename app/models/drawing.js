/* jshint unused:false */

'use strict';

//var bcrypt = require('bcrypt');
var drawingCollection = global.nss.db.collection('drawings');
var Mongo = require('mongodb');
var _ = require('lodash');

var fs = require('fs');
var path = require('path');

class Drawing{
  static create(fields, files, fn){
    var drawing = new Drawing();
    drawing._id = Mongo.ObjectID();
    drawing.userId = fields.userId.toString();
    drawing.name = fields.name;
    drawing.url = fields.url;
    drawing.art = [];
    drawing.processArt(files.art);
    drawing.save(()=>fn(drawing));
  }

  processArt(art){
    art.forEach(a=>{
      var name = this.name + path.extname(a.originalFilename).toLowerCase();
      var file = `/img/${this._id}/${this.name}`;
      var photo = {};
      photo.file = file;

      var userDir = `${__dirname}/../static/img/${this.userId}`;
      var fullDir = `${userDir}/${name}`;

      if(!fs.existsSync(userDir)){fs.mkdirSync(userDir);}
      fs.renameSync(a.path, fullDir);
      this.art.push(photo);
    });
  }

  static findById(drawingId, fn){
    drawingId = Mongo.ObjectID(drawingId);
    drawingCollection.findOne({_id:drawingId}, (e,d)=>{
      if(d){
        d = _.create(Drawing.prototype, d);
        fn(d);
      }else{
        fn(null);
      }
    });
  }

  static findByUserId(userId, fn){
    userId = Mongo.ObjectID(userId);
    drawingCollection.find({userId:userId}).toArray((e, objs)=>{
      console.log(userId);
      console.log('######');
      console.log(objs);
      //if(objs.length === 0){fn(null); return;}
      var drawings = objs.map(o=>_.create(Drawing.prototype, o));
      console.log(drawings);
      fn(drawings);
    });
  }

  save(fn) {
    drawingCollection.save(this, ()=>fn());
  }
}

module.exports = Drawing;
