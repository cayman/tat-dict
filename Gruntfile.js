module.exports = function (grunt) {

    var taskConfig = {
        pkg: grunt.file.readJSON('package.json'),
        jsApp: 'app',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> */',

        jshint: {
            options: {
                jshintrc: '.jshintrc'
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

        concat: {
            options: {
                banner: '<%= banner %>\n',
                separator: '\n/*----------------------------------------*/\n',
                nonull: true
            },
            js: {
                files: [
                    {
                        src: '<%=pkg.src %>/js/*.js',
                        dest: '<%=pkg.build %>/js/<%=jsApp %>.js'
                    }
                ]
            }
        },

        copy: {
            plugin: {
                expand: true,
                cwd: '<%=pkg.src %>',
                src: [ '**/*.css', '**/*.json', '**/*.php'],
                dest: '<%=pkg.build %>'
            },
            lib: {
                expand: true,
                cwd: 'bower_components',
                src: [ '**/*.js', '**/*.map', '**/*.css', '!Gruntfile.js',
                    '!jquery/**', '!bootstrap/**',
                    '!src/**', '!test/**', '!grunt/**','!sample/**'],
                dest: '<%=pkg.build %>/lib'
            },
            bootstrap: {
                expand: true,
                cwd: 'bower_components',
                src: [ 'bootstrap/dist/**'],
                dest: '<%=pkg.build %>/lib'
            }
        },

        uglify: {
            options: {
                sourceMap: true
            },
            js: {
                files: [
                    {src: 'build/js/app.js', dest: 'build/js/app.min.js'}
                ]
            }
        },


        watch: {
            all: {
                options: {
                    cwd: '<%= pkg.src %>/src'
                },
                files: [ '**/*.php', '**/*.json', '**/*.js','**/*.yml','**/*.sass','**/*.css'],
                tasks: ['build']
            }
        },

        'ftp-deploy': {
            build: {
                auth: {
                    host: 'hn3.justhost.ru',
                    port: 21,
                    authKey: 'key1'
                },
                src: 'build',
                dest: '/domains/zarur.ru/public_html/wp-content/plugins/tat-dict',
                exclusions: ['temp']
            }
        }

    };
    grunt.initConfig(taskConfig);
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


    grunt.registerTask('build', [
        'jshint:all',
        'clean:all',
        'concat:js',
        'copy',
        'uglify:js'


    ]);

    grunt.registerTask('start', [
        'jshint:all',
        'clean:all',
        'concat:js',
        'copy',
        'uglify:js',
        'watch:all'
    ]);


};