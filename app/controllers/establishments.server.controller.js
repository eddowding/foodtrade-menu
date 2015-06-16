'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Establishment = mongoose.model('Establishment'),
  _ = require('lodash');

/**
 * Create a Establishment
 */
exports.create = function(req, res) {
  var establishment = new Establishment(req.body);
  establishment.user = req.user;
  establishment.client = req.user.client;

  establishment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(establishment);
    }
  });
};

/**
 * Show the current Establishment
 */
exports.read = function(req, res) {
  res.jsonp(req.establishment);
};

/**
 * Update a Establishment
 */
exports.update = function(req, res) {
  var establishment = req.establishment;

  establishment = _.extend(establishment, req.body);

  establishment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(establishment);
    }
  });
};

/**
 * Delete an Establishment
 */
exports.delete = function(req, res) {
  var establishment = req.establishment;

  establishment.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(establishment);
    }
  });
};

/**
 * List of Establishments
 */
exports.list = function(req, res) {
  var query = req.query;
	if (!req.isAdminUser && req.client) {
		query.client = req.client._id;
	}
  Establishment.find(query).sort('-created').populate('user', 'displayName').exec(function(err, establishments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(establishments);
    }
  });
};

exports.establishmentsByUserID = function(req, res) {
  var query = req.query;
  query.user = req.params.userId;
	if (!req.isAdminUser && req.client) {
		query.client = req.client._id;
	}
  Establishment.find(query).sort('-created').exec(function(err, establishments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(establishments);
    }
  });
};

/**
 * Establishment middleware
 */
exports.establishmentByID = function(req, res, next, id) {
  var query = {_id: id};
	if (!req.isAdminUser && req.client) {
		query.client = req.client._id;
	}
  Establishment.findOne(query).populate('user', 'displayName').exec(function(err, establishment) {
    if (err) return next(err);
    if (!establishment) return next(new Error('Failed to load Establishment ' + id));
    req.establishment = establishment;
    next();
  });
};

/**
 * Establishment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.establishment.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};
