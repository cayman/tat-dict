module.exports = function (grunt) {

    var taskConfig = {
        src: 'src',
        dest: 'build',
        jsApp: 'app',
        bower: 'lib',
        banner: '/*! <%= cmp().type %>.<%= cmp().name %> - v<%= cmp().version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= cmp().authors %> */',

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%=src %>/**/*.js'
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
                            '<%=dest %>/**/*'
                        ]
                    }
                ]
            }
        },

        concat: {
            options: {
                banner: '<%= banner %>\n',
                separator: '\n/*-------------*/\n',
                nonull: true
            },
            js: {
                files: [
                    {
                        src: '<%=src %>/js/*.js',
                        dest: '<%=dest %>/js/<%=jsApp %>.js'
                    }
                ]
            }
        },

        copy: {
            plugin: {
                expand: true,
                cwd: '<%=src %>',
                src: [ '**/*.css', '**/*.json', '**/*.php'],
                dest: '<%=dest %>'
            },
            lib: {
                expand: true,
                cwd: '<%=bower %>',
                src: [ '**/*.js', '**/*.map', '**/*.css', '!Gruntfile.js',
                    '!src/**', '!test/**', '!grunt/**','!sample/**'],
                dest: '<%=dest %>/lib'
            }
        },



        watch: {
            all: {
                options: {
                    cwd: '<%= src %>/src'
                },
                files: [ '**/*.php', '**/*.json', '**/*.js','**/*.yml','**/*.sass','**/*.css'],
                tasks: ['build']
            }
        }

    };
    grunt.initConfig(taskConfig);
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


    grunt.registerTask('build', [
        'jshint:cmp',
        'clean:cmp',
        'concat:js',
        'copy'
    ]);

    grunt.registerTask('start', [
        'jshint:cmp',
        'clean:cmp',
        'concat:js',
        'copy',
        'watch:all'
    ]);


};