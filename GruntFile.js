module.exports = function(grunt){

	var globalconfig = {
		htmlpath: 'app/*.html',
		scsspath: 'app/assets/sass/',
		jspath: 'app/assets/js/'
	};

	// Project ocnfiguration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// grunt-express will serve the files from the
		// folders listend in `bases`
		// on specified `port` and `hostname`
		express: {
			all: {
				options: {
					port: 9000,
					hostname: "0.0.0.0",
					bases: ["app"],

					livereload: true
				}
			}
		},

		// grunt watch will monitor the projects files
		watch: {
			html: {
				// Replace with whatever you want to trigger the update of the files
				// Either as a string for a single entry
				// or an Array of String for multiple entries
				// You can use globing patterns like `css/**/*css`
				// See https://github.com/gruntjs/grunt-contrib-watch#files
				files: globalconfig.htmlpath,
				tasks: ['htmlhint'],
				options: {
					livereload:true
				}
			},
			styles: {
				files: globalconfig.scsspath+"/*.scss",
				tasks: ['sass'],
				options: {
					livereload:true
				}
			},
			js: {
				files: globalconfig.jspath+"/*.js",
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			}

		},

		// grunt open will open your browser at the project's URL
		open: {
			all: {
				// Gets the port from connect configuration
				path: 'http://localhost:<%= express.all.options.port%>'
			}
		},

		sass: {
			dist: {
				files: {
					'app/assets/styles/main.css': 'app/assets/sass/main.scss'
				}
			}
		},
		jshint: {
			all: ['GruntFile.js', 'app/assets/js/*.js']
		},
		htmlhint: {
			html1: {
				options: {
					'tag-pair': true
				},
				src: [globalconfig.htmlpath]
			}
		},
		// Release
		copy: {
			release: {
				files: [
					// COPY ALL
					{ 	expand: true, cwd: 'app/', src: ['**'], dest: 'release/' }

				]
			},
		},
		concat: {
			release: {
				src: [ './release/assets/components/jquery/dist/jquery.js',
				'./release/assets/components/bootstrap-sass/assets/javascripts/bootstrap.js',
				'./release/assets/components/gsap/src/uncompressed/TweenLite.js',
				'./release/assets/components/gsap/src/uncompressed/easing/EasePack.js',
				'./release/assets/js/nodesplugin.js',
				'./release/assets/js/main.js'
			],
			dest: './release/assets/js/4321.js',
		}
	},
	clean: {
		release: ['./release']
	},
	uglify: {
		release: {
			files: {
				'./release/assets/js/4321.min.js': ['./release/assets/js/4321.js']
			}
		}
	},
	cssmin: {
		release: {
			files: {
				'./release/assets/styles/main.min.css': ['./release/assets/styles/main.css']
			}
		}
	},
	processhtml: {
		release: {
			files: {
				'./release/index.html': ['./release/index.html']
			}
		}
	},
	htmlmin: {
		release: {
			options: {                                 // Target options
			       removeComments: true,
			       collapseWhitespace: true
			     },
			files: {
				'./release/index.html': ['./release/index.html']
			}
		}
	}
});

// IMPORT module

grunt.loadNpmTasks('grunt-parallel');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-open');
grunt.loadNpmTasks('grunt-express');
grunt.loadNpmTasks('grunt-htmlhint');
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-processhtml');
grunt.loadNpmTasks('grunt-contrib-htmlmin');
// set default task(s)


grunt.registerTask('build', [
	'htmlhint',
	'jshint',
	'sass:dist'
]);

grunt.registerTask('publish', '' , function(){
	var exec = require('child_process').execSync;
	var result = exec("git push origin `git subtree split --prefix release master`:gh-pages --force", {encoding: 'utf8'});
	grunt.log.writeln(result);
});
grunt.registerTask('build:release', [
	'clean:release', 	// delete release folder
	'copy:release',		// copy html,js files from dist to release
	'concat:release',	// concat all js inside release folder
	'uglify:release', 	// minify all js files
	'cssmin:release', 	// minify css
	'processhtml:release',	// replace script blocks with minified versions
	'htmlmin:release'	// minif html
]);


grunt.registerTask('server', [
	'express',
	'open',
	'watch'
]);
};
