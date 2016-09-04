var gulp = require('gulp'); //>=3.8.8
var g = require('gulp-load-plugins')({lazy: false});
var del = require('del');
var pkg = require('./package.json');
var mainBowerFiles   = require('main-bower-files');
var ftp = require( 'vinyl-ftp' );
var ftpParams = {
    host: 'ftp.zarur.ru',
    user: 'u2262s8598',
    password: 'TWatkx7v',
    parallel: 3,
    log:      g.util.log
};
var ftpPath = '/domains/zarur.ru/public_html/wp-content/plugins/tat-dict/';

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
        .pipe(g.sourcemaps.init())
        .pipe(g.concat(pkg.name + '.js'))
        .pipe(g.ngAnnotate())
        .pipe(g.header(banner, { pkg: pkg}))
        .pipe(gulp.dest(pkg.build + '/js'))
        .pipe(g.uglify())
        .pipe(g.rename({suffix: '.min'}))
        .pipe(g.sourcemaps.write())
        .pipe(gulp.dest(pkg.build + '/js'));
});

gulp.task('json', ['clean'], function () {
    return gulp.src(['*/*.json'], { cwd: pkg.src })
        .pipe(g.jsonminify())
        .pipe(gulp.dest(pkg.build));
});

gulp.task('style', ['clean'], function () {
    return gulp.src('sass/*.scss', { cwd: pkg.src })
        .pipe(g.sourcemaps.init())
        .pipe(g.sass())
//        .pipe(g.csslint())
//        .pipe(g.csslint.reporter())
        .pipe(g.rename({basename: pkg.name}))
        .pipe(gulp.dest(pkg.build + '/css'))
        .pipe(g.minifyCss())
        .pipe(g.rename({suffix: '.min'}))
        .pipe(g.sourcemaps.write())
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
    var jsFilter = g.filter('**/*.js',{restore: true});  //отбираем только  javascript файлы
    var cssFilter = g.filter('**/*.css',{restore: true});  //отбираем только css файлы
    var dest = pkg.build + '/lib';

    return gulp.src(mainBowerFiles({
               // includeDev: true
                //в настройках модуля mainBowerFiles указываем, что в файле bower.json список наших библиотек храниться в блоке с префиксом dev (devDependencies) . Если Вы сохраняете свои библиотеки без префикска dev, то данная настройка не нужна.
            }))
        .pipe(jsFilter)
        .pipe(g.uglify())
        .pipe(g.rename({suffix: '.min'}))
        .pipe(gulp.dest(dest))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(g.minifyCss())
        .pipe(g.rename({suffix: '.min'}))
        .pipe(gulp.dest(dest))
        .pipe(cssFilter.restore);

    // var dest = pkg.build + '/lib';
    // return gulp.src('**', { cwd: 'bower_components' })
    //     .pipe(angularFiles)
    //     .pipe(gulp.dest(dest))
    //     .pipe(angularFiles.restore)
    //     .pipe(g.filter([ '*/dist/**', '*/bower.json' ]))
    //     .pipe(gulp.dest(dest));
});


gulp.task('build', ['copy', 'script', 'style', 'json', 'replace'], function () {
});

gulp.task('default', ['build'], function () {
    var conn = ftp.create(ftpParams);

    return gulp.src('**/*', { cwd: pkg.build, buffer: false })
        .pipe(g.filter(['css/*', '**/*.php', 'js/*']))
        .pipe( conn.newer( ftpPath ) ) // only upload newer files
        .pipe( conn.dest( ftpPath ) );

});

gulp.task('deploy', ['lib','build'], function () {

    var conn = ftp.create(ftpParams);

    return gulp.src('**/*', { cwd: pkg.build, buffer: false })
        .pipe(g.filter(['lib/*', 'img/*', 'css/*', '**/*.php', 'js/*']))
        .pipe( conn.newer( ftpPath ) ) // only upload newer files
        .pipe( conn.dest( ftpPath ) );

});