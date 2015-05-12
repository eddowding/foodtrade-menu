'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
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
    index: '2dsphere'
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
  account: {
    type: Schema.ObjectId,
    ref: 'Account'
  }
});

mongoose.model('Establishment', EstablishmentSchema);
