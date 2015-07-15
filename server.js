'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
  config = require('./config/config'),
  mongoose = require('mongoose'),
  chalk = require('chalk');
var elasticsearch = require('elasticsearch');
var esClient = new elasticsearch.Client({
  host: 'localhost:9200'
});
/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
  if (err) {
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(chalk.red(err));
  }
});
var establishmentMapping = {
  "establishment": {
    "properties": {
      "LocalAuthorityName": {
        "type": "string"
      },
      "scores": {
        "type": "nested",
        "include_in_parent": true,
        "properties": {
          "Structural": {
            "type": "long"
          },
          "ConfidenceInManagement": {
            "type": "long"
          },
          "Hygiene": {
            "type": "long"
          }
        }
      },
      "BusinessType": {
        "type": "string"
      },
      "grids": {
        "type": "nested",
        "include_in_parent": true,
        "properties": {
          "created": {
            "format": "dateOptionalTime",
            "type": "date"
          },
          "name": {
            "type": "string"
          },
          "tableData": {
            "type": "nested",
            "include_in_parent": true,
            "properties": {
              "item": {
                "type": "nested",
                "include_in_parent": true,
                "properties": {
                  "isEdit": {
                    "type": "boolean"
                  },
                  "name": {
                    "type": "string"
                  },
                  "type": {
                    "type": "long"
                  },
                  "characteristic": {
                    "properties": {
                      "text": {
                        "type": "string"
                      }
                    }
                  }
                }
              },
              "other": {
                "properties": {
                  "allergenType": {
                    "type": "string"
                  }
                }
              },
              "crustacean": {
                "properties": {
                  "allergenType": {
                    "type": "string"
                  }
                }
              },
              "egg": {
                "properties": {
                  "allergenType": {
                    "type": "string"
                  }
                }
              },
              "lupin": {
                "properties": {
                  "allergenType": {
                    "type": "string"
                  }
                }
              },
              "milk": {
                "properties": {
                  "allergenType": {
                    "type": "string"
                  }
                }
              },
              "nut": {
                "properties": {
                  "allergenType": {
                    "type": "string"
                  },
                  "allergens": {
                    "type": "string"
                  }
                }
              },
              "veggie": {
                "properties": {
                  "edit": {
                    "type": "boolean"
                  },
                  "type": {
                    "type": "string"
                  }
                }
              },
              "soya": {
                "properties": {
                  "allergenType": {
                    "type": "string"
                  }
                }
              },
              "mustard": {
                "properties": {
                  "allergenType": {
                    "type": "string"
                  }
                }
              },
              "sulphurDioxide": {
                "properties": {
                  "allergenType": {
                    "type": "string"
                  }
                }
              },
              "celery": {
                "properties": {
                  "allergenType": {
                    "type": "string"
                  }
                }
              },
              "cereal": {
                "properties": {
                  "allergenType": {
                    "type": "string"
                  }
                }
              },
              "mollusc": {
                "properties": {
                  "allergenType": {
                    "type": "string"
                  }
                }
              },
              "fish": {
                "properties": {
                  "allergenType": {
                    "type": "string"
                  }
                }
              },
              "peanut": {
                "properties": {
                  "allergenType": {
                    "type": "string"
                  }
                }
              },
              "sesameSeed": {
                "properties": {
                  "allergenType": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "_id": {
            "type": "string"
          },
          "updated": {
            "format": "dateOptionalTime",
            "type": "date"
          },
          "user": {
            "type": "string"
          }
        }
      },
      "FHRSID": {
        "type": "long"
      },
      "SchemeType": {
        "type": "string"
      },
      "BusinessTypeID": {
        "type": "string"
      },
      "Phone": {
        "type": "string"
      },
      "__v": {
        "type": "long"
      },
      "LocalAuthorityEmailAddress": {
        "type": "string"
      },
      "RatingKey": {
        "type": "string"
      },
      "LocalAuthorityCode": {
        "type": "string"
      },
      "RatingDate": {
        "format": "dateOptionalTime",
        "type": "date"
      },
      "BusinessName": {
        "type": "string"
      },
      "LocalAuthorityBusinessID": {
        "type": "string"
      },
      "LocalAuthorityWebSite": {
        "type": "string"
      },
      "created": {
        "format": "dateOptionalTime",
        "type": "date"
      },
      "RightToReply": {
        "type": "string"
      },
      "AddressLine3": {
        "type": "string"
      },
      "AddressLine2": {
        "type": "string"
      },
      "AddressLine1": {
        "type": "string"
      },
      "AddressLine4": {
        "type": "string"
      },
      "WebSite": {
        "type": "string"
      },
      "RatingValue": {
        "type": "string"
      },
      "PostCode": {
        "type": "string"
      },
      "user": {
        "properties": {
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "provider": {
            "type": "string"
          },
          "created": {
            "format": "dateOptionalTime",
            "type": "date"
          },
          "__v": {
            "type": "long"
          },
          "_id": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "username": {
            "type": "string"
          }
        }
      }
    }
  }
};
esClient.indices.exists({
  index: 'ftm'
}, function(err, response) {
  if (err) {
    throw err;
  }
  if (!response) {
    esClient.indices.create({
      index: 'ftm'
    }, function(err, response) {
      esClient.indices.putMapping({
        index: "ftm",
        type: "establishment",
        body: establishmentMapping
      }, function(err, response) {
				console.log(err, response);
			});
    });
  }
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);
