'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Grid = mongoose.model('Grid'),
  _ = require('lodash');

/**
 * Create a Grid
 */
exports.create = function(req, res) {
  var grid = new Grid(req.body);
  grid.user = req.user;

  grid.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(grid);
    }
  });
};

/**
 * Show the current Grid
 */
exports.read = function(req, res) {
  res.jsonp(req.grid);
};

/**
 * Update a Grid
 */
exports.update = function(req, res) {
  var grid = req.grid;

  grid = _.extend(grid, req.body);

  grid.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(grid);
    }
  });
};

/**
 * Delete an Grid
 */
exports.delete = function(req, res) {
  var grid = req.grid;

  grid.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(grid);
    }
  });
};

/**
 * List of Grids
 */
exports.list = function(req, res) {
  Grid.find(req.query).sort('-created').populate('user').exec(function(err, grids) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(grids);
    }
  });
};

exports.gridsByUserID = function(req, res) {
  Grid.find({
    user: req.params.userId
  }).sort('-created').exec(function(err, grids) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(grids);
    }
  });
};

exports.gridPrint = function(req, res) {
  var gridColumns = [
    'nut',
    'peanut',
    'sesameSeed',
    'fish',
    'crustacean',
    'mollusc',
    'egg',
    'milk',
    'cereal',
    'lupin',
    'celery',
    'mustard',
    'soya',
    'sulphurDioxide',
    'other'
  ];
  Grid.findById(req.params.gridId).exec(function(err, grid) {
    res.render('grid-print', {grid: grid, gridColumns: gridColumns});
  });
};

/**
 * Grid middleware
 */
exports.gridByID = function(req, res, next, id) {
  Grid.findById(id).populate('user', 'displayName').exec(function(err, grid) {
    if (err) return next(err);
    if (!grid) return next(new Error('Failed to load Grid ' + id));
    req.grid = grid;
    next();
  });
};

/**
 * Grid authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.grid.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};
