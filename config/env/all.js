'use strict';

module.exports = {
	app: {
		title: 'alrg',
		description: 'MEAN stack to manage FSA menu',
		keywords: 'FSA, food, menu'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/font-awesome/css/font-awesome.css',
                'public/lib/ng-tags-input/ng-tags-input.css',
                'public/lib/ng-tags-input/ng-tags-input.bootstrap.css',
                'public/lib/sweetalert/dist/sweetalert.css',
								'public/lib/angular-xeditable/dist/css/xeditable.css',
								'public/lib/ngOnboarding/dist/ng-onboarding.css',
								'public/lib/ngprogress/ngProgress.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/jquery/dist/jquery.js',
                'public/lib/bootstrap/dist/js/bootstrap.js',
                'public/lib/angular-elastic/elastic.js',
                'public/lib/ng-tags-input/ng-tags-input.js',
                'public/lib/sweetalert/dist/sweetalert-dev.js',
                'public/lib/angular-sweetalert/SweetAlert.js',
								'public/lib/zeroclipboard/dist/ZeroClipboard.js',
								'public/lib/ng-clip/src/ngClip.js',
								'public/lib/angular-xeditable/dist/js/xeditable.js',
								'public/lib/ng-autofocus/dist/ng-autofocus.js',
								'public/lib/floatThead/dist/jquery.floatThead.js',
								'public/lib/moment/moment.js',
								'public/lib/ngOnboarding/dist/ng-onboarding.js',
								'public/lib/ngprogress/build/ngProgress.js'

			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
