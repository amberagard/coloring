/* jshint unused:false */

'use strict';

var drawingCollection = global.nss.db.collection('drawings');
var Mongo = require('mongodb');
var _ = require('lodash');

var fs = require('fs');
var path = require('path');

class Drawing{
  static create(userId, fields, files, fn){
    var drawing = new Drawing();
    drawing.userId = Mongo.ObjectID(userId);
    drawing._id = Mongo.ObjectID();
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
      var drawings = objs.map(o=>_.create(Drawing.prototype, o));
      fn(drawings);
    });
  }

  static deleteByDrawingId(drawingId, fn) {
    drawingId = Mongo.ObjectID(drawingId);
    drawingCollection.remove({_id:drawingId}, (e, drawing)=>{
      fn(drawing);
    });
  }

  save(fn) {
    drawingCollection.save(this, ()=>fn());
  }
}

module.exports = Drawing;
