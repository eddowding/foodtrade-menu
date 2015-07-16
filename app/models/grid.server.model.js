'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var async = require('async');
var elasticsearch = require('elasticsearch');
var esClient = new elasticsearch.Client({
  host: 'localhost:9200'
});

/**
 * Grid Schema
 */
var GridSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please give this a name',
    trim: true
  },
  tableData: {
    type: Array,
    required: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  client: {
    type: Schema.ObjectId,
    ref: 'Client'
  }
});

GridSchema.set('versionKey', false);

GridSchema.post('save', function(doc) {
  if (!doc.user) {
    return;
  }
  var User = mongoose.model('User');
  var Establishment = mongoose.model('Establishment');
  var Grid = mongoose.model('Grid');

  async.parallel({
    user: function(callback) {
      User.findById(doc.user._id, function(err, user) {
        callback(err, user);
      }).lean(true);
    },
    establishment: function(callback) {
      Establishment.findOne({
        user: doc.user
      }).lean(true).exec(function(err, establishment) {
        callback(err, establishment);
      });
    },
    grids: function(callback) {
      Grid.find({
        user: doc.user
      }).lean(true).exec(function(err, grids) {
        callback(err, grids);
      });
    }

  }, function(err, results) {
    if (err) {
      throw err;
    }
    var indexObj = results.establishment;
    indexObj.user = results.user;
    delete indexObj.user.salt;
    delete indexObj.user.password;
    delete indexObj.user.displayName;
    delete indexObj.user.roles;
    indexObj.grids = results.grids;
    esClient.delete({
      index: 'ftm',
      type: 'establishment',
      id: indexObj._id.toString()
    }, function(err, response) {
      esClient.create({
        index: 'ftm',
        type: 'establishment',
        id: indexObj._id.toString(),
        body: indexObj
      }, function(err, response) {
        if (err) {
          throw err;
        }
      });
    });
  });
});

mongoose.model('Grid', GridSchema);
