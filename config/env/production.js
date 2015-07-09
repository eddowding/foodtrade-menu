'use strict';

module.exports = {
  db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/alrg',
  app: {
    title: 'FoodTrade Menu - simple allergen compliance'
  },
  assets: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/lib/font-awesome/css/font-awesome.min.css',
        'public/lib/ng-tags-input/ng-tags-input.min.css',
        'public/lib/ng-tags-input/ng-tags-input.bootstrap.min.css',
        'public/lib/sweetalert/dist/sweetalert.css',
        'public/lib/angular-xeditable/dist/css/xeditable.css',
        'public/lib/ngOnboarding/dist/ng-onboarding.css',
        'public/lib/ngprogress/ngProgress.css'
      ],
      js: [
        'public/lib/angular/angular.min.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-cookies/angular-cookies.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-touch/angular-touch.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-ui-utils/ui-utils.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/bootstrap/dist/js/bootstrap.min.js',
        'public/lib/angular-elastic/elastic.js',
        'public/lib/ng-tags-input/ng-tags-input.min.js',
        'public/lib/sweetalert/dist/sweet-alert.min.js',
        'public/lib/angular-sweetalert/SweetAlert.min.js',
        'public/lib/zeroclipboard/dist/ZeroClipboard.min.js',
        'public/lib/ng-clip/dest/ng-clip.min.js',
        'public/lib/angular-xeditable/dist/js/xeditable.min.js',
        'public/lib/ng-autofocus/dist/ng-autofocus.js',
        'public/lib/floatThead/dist/jquery.floatThead.min.js',
        'public/lib/moment/min/moment.min.js',
        'public/lib/ngOnboarding/dist/ng-onboarding.min.js',
        'public/lib/ngprogress/build/ngProgress.min.js',
        'public/lib/ng-file-upload/ng-file-upload-shim.min.js',
        'public/lib/ng-file-upload/ng-file-upload.min.js',
        'public/lib/elasticsearch/elasticsearch.angular.min.js',
        'public/lib/elastic.js/dist/elastic.min.js',
        'public/lib/angular-google-maps/dist/angular-google-maps.min.js',
        'public/lib/lodash/lodash.min.js'
      ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: '/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/auth/github/callback'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  }
};
