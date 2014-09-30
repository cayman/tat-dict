module.exports = function (grunt) {

    var pkg = grunt.file.readJSON( 'package.json' );

    var taskConfig = {
        pkg: grunt.file.readJSON('package.json'),
        pass: grunt.file.readJSON('.ftppass'),
        jsApp: 'app',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> */',

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                force: true
            },
            all: [
                'Gruntfile.js',
                '<%=pkg.src %>/**/*.js'
            ]
        },

        clean: {
            options: {
                force: true
            },
            all: {
                files: [
                    {
                        src: [
                            '<%=pkg.build %>/**/*'
                        ]
                    }
                ]
            }
        },

        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: /({{(\w*)}})/g,
                            replacement: function ( match, offset, string, source, target ) {
                                return pkg[string];
                            }
                        }
                    ]
                }, files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['<%=pkg.src %>/<%=pkg.main %>'],
                        dest: '<%=pkg.build %>/'
                    }
                ]
            }
        },

        concat: {
            options: {
                banner: '<%= banner %>\n',
                separator: '\n/*----------------------------------------*/\n',
                nonull: true
            },
            js: {
                files: [
                    {
                        src: '<%=pkg.src %>/<%=pkg.app %>.*.js',
                        dest: '<%=pkg.build %>/<%=pkg.app %>.js'
                    }
                ]
            }
        },

        ngAnnotate: {
            js: {
                files: [
                    {
                        expand: true,
                        src: '<%=pkg.build %>/<%=pkg.app %>.js',
                        ext: '.annotated.js',
                        extDot: 'last'       // Extensions in filenames begin after the last dot
                    }
                ]
            }
        },

        sass: {
            compile: {
                files: {
                    '<%=pkg.build %>/css/dictionary.css': '<%=pkg.src %>/sass/dictionary.scss'
                },
                options: {
                    includePaths: [
                        '<%=pkg.src %>/sass'
                    ]
                }
            }
        },

        uglify: {
            options: {
                sourceMap: true
            },
            js: {
                files: [
                    {
                        src: '<%=pkg.build %>/<%=pkg.app %>.annotated.js',
                        dest: '<%=pkg.build %>/<%=pkg.app %>.min.js'
                    }
                ]
            }
        },

        copy: {
            plugin: {
                expand: true,
                cwd: '<%=pkg.src %>',
                src: [ '**/*.json', '*/*.php', '*/*.png', '*/*.gif'],
                dest: '<%=pkg.build %>'
            },
            angular: {
                expand: true,
                cwd: 'bower_components',
                src: [ 'angular*/**/*.js', 'angular*/**/*.map', 'angular*/**/*.css'],
                dest: '<%=pkg.build %>/lib'
            },
            lib: {
                expand: true,
                cwd: 'bower_components',
                src: [ '*/dist/**'],
                dest: '<%=pkg.build %>/lib'
            }
        },

        watch: {
            all: {
                options: {
                    cwd: '<%= pkg.src %>/src'
                },
                files: [ '**/*.php', '**/*.json', '**/*.js', '**/*.yml', '**/*.sass', '**/*.css'],
                tasks: ['build']
            }
        },

        'ftp-deploy': {
            code: {
                auth: {
                    host: '<%=pass.host %>',
                    port: 21,
                    authKey: 'key1'
                },
                src: 'build',
                dest: '/domains/<%=pass.host %>/public_html/wp-content/plugins/tat-dict',
                exclusions: ['temp', 'lib',  '**/*.map', '**/*.js', '!**/<%=pkg.js %>']
            },
            lib: {
                auth: {
                    host: '<%=pass.host %>',
                    port: 21,
                    authKey: 'key1'
                },
                src: 'build/lib',
                dest: '/domains/<%=pass.host %>/public_html/wp-content/plugins/tat-dict/lib'
            }
        }

    };
    grunt.initConfig(taskConfig);
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


    grunt.registerTask('build', [
        'jshint:all',
        'clean:all',
        'sass',
        'replace',
        'concat:js',
        'ngAnnotate:js',
        'uglify:js',
        'copy'
    ]);

    grunt.registerTask('deploy', [
        'build',
        'ftp-deploy:code'
    ]);

    grunt.registerTask('deploy-full', [
        'build',
        'ftp-deploy:code',
        'ftp-deploy:lib'
    ]);



};