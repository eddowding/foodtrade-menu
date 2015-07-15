'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  mongoosastic = require('mongoosastic'),
  Schema = mongoose.Schema;

/**
 * Establishment Schema
 */

var EstablishmentSchema = new Schema({
  FHRSID: {
    type: Number,
    required: false
  },
  LocalAuthorityBusinessID: {
    type: String,
    required: false
  },
  BusinessName: {
    type: String,
    required: true
  },
  BusinessType: {
    type: String,
    required: false
  },
  BusinessTypeID: {
    type: String,
    required: false
  },
  AddressLine1: {
    type: String,
    required: false
  },
  AddressLine2: {
    type: String,
    required: false
  },
  AddressLine3: {
    type: String,
    required: false
  },
  AddressLine4: {
    type: String,
    required: false
  },
  PostCode: {
    type: String,
    required: false
  },
  Phone: {
    type: String,
    required: false
  },
  RatingValue: {
    type: String,
    required: false
  },
  RatingKey: {
    type: String,
    required: false
  },
  RatingDate: {
    type: Date,
    required: false
  },
  LocalAuthorityCode: {
    type: String,
    required: false
  },
  LocalAuthorityName: {
    type: String,
    required: false
  },
  LocalAuthorityWebSite: {
    type: String,
    required: false
  },
  LocalAuthorityEmailAddress: {
    type: String,
    required: false
  },
  scores: {
    Hygiene: {
      type: Number,
      required: true,
      default: 0
    },
    Structural: {
      type: Number,
      required: true,
      default: 0
    },
    ConfidenceInManagement: {
      type: Number,
      required: true,
      default: 0
    }
  },
  SchemeType: {
    type: String,
    required: false
  },
  geocode: {
    type: [Number],
    index: '2dsphere',
    es_type: 'geo_point'
  },
  RightToReply: {
    type: String,
    required: false
  },
  WebSite: {
    type: String,
    required: false
  },
  created: {
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

EstablishmentSchema.plugin(mongoosastic, {
  index: 'ftm',
  type: 'establishment'
});
mongoose.model('Establishment', EstablishmentSchema);

// var Establishment = mongoose.model('Establishment');
// var stream = Establishment.synchronize();
// var count = 0;
//
// stream.on('data', function(err, doc) {
//   count++;
// });
// stream.on('close', function() {
//   console.log('indexed ' + count + ' documents!');
// });
// stream.on('error', function(err) {
//   console.log(err);
// });
