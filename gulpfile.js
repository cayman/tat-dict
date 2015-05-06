var gulp = require('gulp'); //>=3.8.8
var g = require('gulp-load-plugins')({lazy: false});
var del = require('del');
var pkg = require('./package.json');
var ftp = require('./.ftp.json');


gulp.task('clean', function (done) {
    return del([pkg.build + '/**/*', '!' + pkg.build + '/lib/**'], { force: false }, done);
});

gulp.task('lint', ['clean'], function () {
    return gulp.src(['./gulpfile.js', pkg.src + '/js/*.js'])
        .pipe(g.jshint())
        .pipe(g.jshint.reporter('jshint-stylish'));
});

gulp.task('script', ['lint', 'clean'], function () {

    var banner = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''].join('\n');

    return gulp.src(['js/app._*.js','js/*.js'], { cwd: pkg.src })
        .pipe(g.concat(pkg.app + '.js'))
        .pipe(g.ngAnnotate())
        .pipe(g.header(banner, { pkg: pkg}))
       // .pipe(gulp.dest(pkg.build))
        .pipe(g.uglifyjs(pkg.app + '.min.js', { outSourceMap: false }))
        .pipe(gulp.dest(pkg.build));
});

gulp.task('json', ['clean'], function () {
    return gulp.src(['*/*.json'], { cwd: pkg.src })
        .pipe(g.jsonminify())
        .pipe(gulp.dest(pkg.build));
});

gulp.task('style', ['clean'], function () {
    return gulp.src('sass/*.scss', { cwd: pkg.src })
        .pipe(g.sass())
//        .pipe(g.csslint())
//        .pipe(g.csslint.reporter())
        .pipe(gulp.dest(pkg.build + '/css'))
        .pipe(g.minifyCss())
        .pipe(gulp.dest(pkg.build + '/css'));
});

gulp.task('replace', ['clean'], function () {
    return gulp.src(pkg.main, { cwd: pkg.src })
        .pipe(g.replace(/({{(\w*)}})/g,
            function (match, offset, string, source, target) {
                return pkg[string];
            }
        ))
        .pipe(gulp.dest(pkg.build));
});


gulp.task('copy', ['clean'], function () {
    return gulp.src([ '*/*.php', '*/*.png', '*/*.gif'], { cwd: pkg.src })
        .pipe(gulp.dest(pkg.build));
});


gulp.task('lib', ['clean'], function () {
    var angular;
    var dest = pkg.build + '/lib';
    return gulp.src('**', { cwd: 'bower_components' })
        .pipe(angular = g.filter([ 'angular*/**/angular*.js','angular*/**/*.map', 'angular*/**/*.css', '*/bower.json']))
        .pipe(gulp.dest(dest))
        .pipe(angular.restore())
        .pipe(g.filter([ '*/dist/**', '*/bower.json' ]))
        .pipe(gulp.dest(dest));
});


gulp.task('build', ['copy', 'script', 'style', 'json', 'replace'], function () {
});

gulp.task('default', ['build'], function () {
    return gulp.src('**/*', { cwd: pkg.build })
        .pipe(g.filter(['css/*', '**/*.php', 'js/*.json', pkg.js]))
        .pipe(g.ftp(ftp));
//        .pipe(gulp.dest(pkg.build + '1'));
});

gulp.task('full', ['lib', 'build'], function () {
    return gulp.src('**/*', { cwd: pkg.build })
        .pipe(g.filter(['css/*', '**/*.php', 'js/*.json', pkg.js, 'lib/**', 'img/**']))
         .pipe(g.ftp(ftp));
        //.pipe(gulp.dest(pkg.build + '1'));
});