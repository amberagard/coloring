'use strict';

var bcrypt = require('bcrypt');
var userCollection = global.nss.db.collection('users');
var Mongo = require('mongodb');
var _ = require('lodash');

class User{
  static register(obj, fn){
    userCollection.findOne({email:obj.email}, (e,u)=>{
      if(!u){
        var user = new User();
        user.email = obj.email;
        user.facebook.name = obj.facebook.name;
        user.password = bcrypt.hashSync(obj.password, 8);
        userCollection.save(user, ()=>fn(user));
      }else{
        fn(null);
      }
    });
  }

  static login(obj, fn){
    userCollection.findOne({email:obj.email}, (e,u)=>{
      if(u){
        var isMatch = bcrypt.compareSync(obj.password, u.password);
        if(isMatch){
          fn(u);
        }else{
          fn(null);
        }
      }else{
        fn(null);
      }
    });
  }

  static findById(userId, fn){
    userId = Mongo.ObjectID(userId);
    userCollection.findOne({_id:userId}, (e,user)=>{
      if(user){
        user = _.create(User.prototype, user);
        fn(null, user);
      }else{
        fn(e, null);
      }
    });
  }

  static findByFacebookId(facebookId, fn){
    userCollection.findOne({facebookId:facebookId},(err, user)=>{
      fn(err, _.extend(user, User.prototype));
    });
  }

  static findByTwitterId(twitterId, fn){
    userCollection.findOne({twitterId:twitterId},(err, user)=>{
      fn(err, _.extend(user, User.prototype));
    });
  }

  save(fn) {
    userCollection.save(this, ()=>fn());
  }
}

module.exports = User;
