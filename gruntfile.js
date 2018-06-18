module.exports = function(grunt) {

	// load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.loadNpmTasks('grunt-exec');

	// Project configuration.
	grunt.initConfig({
		haxe: {
			hxmlBuild: {
				hxml: 'build.hxml'
			}
		},
		connect: {
			server: {
				options: {
					port: 9000,
					base: 'bin'
				}
			}
		},
		exec: { server: { cmd: "sh ./bat/server" } },
		watch: {
			hx: {
				files: ['**/*.hx'],
				tasks: ['haxe'],
				options: {
					interrupt: true,
					livereload: true
				}
			},
			html: {
				files: 'bin/**/*.html',
				options: {
					livereload: true
				}
			},
			configBuild: {
				files: ['build.hxml'],
				tasks: ['haxe'],
				options: {
					interrupt: true,
				}
			},
			configGrunt: {
				files: ['Gruntfile.js'],
				options: {
					reload: true
				}
			}
		}
	});

	grunt.registerTask('server', 'Start a custom web server', function() {
		grunt.log.writeln('Started web server on port 8089');
		require('./server/server.js').listen(8089);
	});

	// Default task(s).
	grunt.registerTask('default', ['haxe', 'connect', 'watch']);
};