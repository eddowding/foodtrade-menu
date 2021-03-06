'use strict';
var request = require('request');
var mongoose = require('mongoose');
var _ = require('lodash');
var async = require('async');
var deepcopy = require('deepcopy');
var init = require('./config/init')();
var config = require('./config/config');

module.exports = function(grunt) {
  // Unified Watch Object
  var watchFiles = {
    serverViews: ['app/views/**/*.*'],
    serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
    clientViews: ['public/modules/**/views/**/*.html'],
    clientJS: ['public/js/*.js', 'public/modules/**/*.js'],
    clientCSS: ['public/modules/**/*.css'],
    mochaTests: ['app/tests/**/*.js']
  };

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      serverViews: {
        files: watchFiles.serverViews,
        options: {
          livereload: true
        }
      },
      serverJS: {
        files: watchFiles.serverJS,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      clientViews: {
        files: watchFiles.clientViews,
        options: {
          livereload: true,
        }
      },
      clientJS: {
        files: watchFiles.clientJS,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      clientCSS: {
        files: watchFiles.clientCSS,
        tasks: ['csslint'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: {
        src: watchFiles.clientJS.concat(watchFiles.serverJS),
        options: {
          jshintrc: true
        }
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc',
      },
      all: {
        src: watchFiles.clientCSS
      }
    },
    uglify: {
      production: {
        options: {
          mangle: false
        },
        files: {
          'public/dist/application.min.js': 'public/dist/application.js'
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'public/dist/application.min.css': '<%= applicationCSSFiles %>'
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js,html',
          watch: watchFiles.serverViews.concat(watchFiles.serverJS)
        }
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': 'localhost',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 50,
          'hidden': []
        }
      }
    },
    ngAnnotate: {
      production: {
        files: {
          'public/dist/application.js': '<%= applicationJavaScriptFiles %>'
        }
      }
    },
    concurrent: {
      default: ['nodemon', 'watch'],
      debug: ['nodemon', 'watch', 'node-inspector'],
      options: {
        logConcurrentOutput: true,
        limit: 10
      }
    },
    env: {
      test: {
        NODE_ENV: 'test'
      },
      secure: {
        NODE_ENV: 'secure'
      }
    },
    mochaTest: {
      src: watchFiles.mochaTests,
      options: {
        reporter: 'spec',
        require: 'server.js'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt);

  // Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  // A Task for loading the configuration object
  grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
    var init = require('./config/init')();
    var config = require('./config/config');

    grunt.config.set('applicationJavaScriptFiles', config.assets.js);
    grunt.config.set('applicationCSSFiles', config.assets.css);
  });

  // Default task(s).
  grunt.registerTask('default', ['lint', 'concurrent:default']);

  // Debug task.
  grunt.registerTask('debug', ['lint', 'concurrent:debug']);

  // Secure task(s).
  grunt.registerTask('secure', ['env:secure', 'lint', 'concurrent:default']);

  // Lint task(s).
  grunt.registerTask('lint', ['jshint', 'csslint']);

  // Build task(s).
  grunt.registerTask('build', ['lint', 'loadConfig', 'ngAnnotate', 'uglify', 'cssmin']);

  // Test task.
  grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);

  // Fsa data fetch
  grunt.registerTask('fsafetch', 'fetch establishments from FSA APIs', function() {
		mongoose.connect(config.db);
    require('./app/models/establishment.server.model.js');
    var Establishment = mongoose.model('Establishment');
    var done = this.async();
    var pageLimit = 10000;
    var queueWorkers = 20;
    var basicUrl = 'http://api.ratings.food.gov.uk/Establishments/basic/';
    var detailUrl = 'http://api.ratings.food.gov.uk/Establishments/';
    var options = {
      headers: {
        'x-api-version': 2
      }
    };

    var tmpOptions1 = deepcopy(options);
    tmpOptions1.url = basicUrl + '1/1/';

    request(tmpOptions1, function(error1, response1, body1) {
      if (!error1 && response1.statusCode == 200) {
        var data = JSON.parse(body1);

        var totalCount = data.meta.totalCount;
        var totalPages = parseInt(totalCount / pageLimit);

        grunt.log.writeln('Total Count:', totalCount);
        grunt.log.writeln('Total Page Count:', totalPages);

         var pageRange = _.range(1, totalPages + 1);
//        var pageRange = [1];

        var detailRequestQueue = async.queue(function(id, callback) {
          var tmpOptions3 = deepcopy(options);
          tmpOptions3.url = detailUrl + id;
          request(tmpOptions3, function(error3, response3, body3) {
            grunt.log.writeln('Processing data for URL:', tmpOptions3.url);
            if (error3) {
              grunt.log.error(error3);
            } else {
              var data3 = JSON.parse(body3);
              grunt.log.writeln('saving establishment:', data3.FHRSID);
              callback(error3, response3, body3);
            }
          });
        }, queueWorkers);

        detailRequestQueue.drain = function() {
          grunt.log.writeln('All detail requests processed.');
          done();
        };

        var basicRequestQueue = async.queue(function(options, callback) {
          request(options, function(error2, response2, body2) {
            grunt.log.writeln('Processing data for URL:', options.url);
            callback(error2, response2, body2);
            if (error2) {
              grunt.log.error(error2);
            } else {
              var data2 = JSON.parse(body2);
              data2.establishments.forEach(function(establishment, index) {
                detailRequestQueue.push(establishment.FHRSID, function(error3, response3, body3) {
                  var data3 = JSON.parse(body3);
                  Establishment.create(data3, function(err, establishment) {
                    if (err) {
                      grunt.log.error(err);
                    } else {
                      grunt.log.writeln('saved establishment:', establishment.FHRSID);
                    }
                  });
                  grunt.log.writeln('Finished processing detail request.');
                });
              });
            }
          });
        }, 2);

        basicRequestQueue.drain = function() {
          grunt.log.writeln('All basic requests processed.');
        };

        pageRange.forEach(function(page, index) {
          var tmpOptions2 = deepcopy(options);
          tmpOptions2.url = basicUrl + page + '/' + pageLimit + '/';
          grunt.log.writeln('Queuing URL:', tmpOptions2.url);
          basicRequestQueue.push(tmpOptions2, function(err) {
            grunt.log.writeln('Finished processing basic request.');
          });
        });
      }
    })
  });
};
