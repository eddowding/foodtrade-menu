var _ = require('lodash');
var errorHandler = require('../errors.server.controller');
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

exports.list = function(req, res) {
  User.find().sort('-created').populate('user', 'displayName').exec(function(err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(users);
    }
  });
};
