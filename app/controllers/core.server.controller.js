'use strict';

/**
 * Module dependencies.
 */
var policy = require('s3-policy');

exports.index = function(req, res) {
  res.render('index', {
    user: req.user || null,
    request: req
  });
};

exports.s3Policy = function(req, res) {
  var s3Policy = policy({
    secret: 'hsV2PZ44Hg3pjo6MjVwDJQQGi1cyIBMY3wdn8LeB',
    length: 5000000,
    bucket: 'food-trade-menu',
    key: 'AKIAIOFBIFAHIXNK5RMA',
    expires: new Date(Date.now() + 60000),
    acl: 'public-read'
  });
  res.json(s3Policy);
};
