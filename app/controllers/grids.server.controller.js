'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var errorHandler = require('./errors.server.controller');
var Grid = mongoose.model('Grid');
var Establishment = mongoose.model('Establishment');
var _ = require('lodash');
var path = require('path');
var phantom = require('phantom');

/**
 * Create a Grid
 */
exports.create = function(req, res) {
  var grid = new Grid(req.body);
  grid.user = req.user;
  grid.client = req.user.client;

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
  var query = req.query;
	if (!req.isAdminUser && req.client) {
		query.client = req.client._id;
	}
  Grid.find(query).sort('-created').populate('user').exec(function(err, grids) {
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
  var query = req.query;
  query.user = req.params.userId;
	if (!req.isAdminUser && req.client) {
		query.client = req.client._id;
	}
  Grid.find(query).sort('-created').exec(function(err, grids) {
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
    Establishment.findOne({
        user: grid.user
      })
      .exec(function(err, establishment) {
        res.render('grid-print', {
          grid: grid,
          gridColumns: gridColumns,
          establishment: establishment
        });
      });
  });
};


exports.gridPdf = function(req, res) {
  phantom.create(function(ph) {
    ph.createPage(function(page) {
      page.set('viewportSize', {
        height: 2100,
        width: 2900
      });
      page.open('http://' + req.headers.host + '/grids/' + req.params.gridId + '/print', function(status) {
        page.render(path.join(path.dirname(path.dirname(__dirname)), 'downloads', 'grid-' + req.params.gridId + '.pdf'), function() {
          res.download(path.join(path.dirname(path.dirname(__dirname)), 'downloads', 'grid-' + req.params.gridId + '.pdf'));
          ph.exit();
        });
      });
    });
  });
};


/**
 * Grid middleware
 */
exports.gridByID = function(req, res, next, id) {
  var query = {_id: id};
	if (!req.isAdminUser && req.client) {
		query.client = req.client._id;
	}
  Grid.findOne(query).populate('user', 'displayName').exec(function(err, grid) {
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
