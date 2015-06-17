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
    secret: 'buOhnfY/cuGFjfbwoXvGS0f6jQw2OL5EIg0BUG9X',
    length: 5000000,
    bucket: 'foodtrademenu',
    key: 'AKIAJCJT3UGC75BPM72Q',
    expires: new Date(Date.now() + 60000),
    acl: 'public-read'
  });
  res.json(s3Policy);
};
