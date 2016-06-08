require('es6-promise').polyfill();
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var freeze = require('gulp-freeze');
var base64 = require('gulp-base64');
var inject = require('gulp-inject');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var gutil = require('gulp-util');
var gulp = require('gulp');
var del = require('del');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var es = require('event-stream');

gulp.task('clean', function() {
    del.sync(['./asset/built/css/*', './asset/built/js/*', './server.built.js']);
});

gulp.task('javascript', ['clean'], function() {
    // set up the browserify instance on a task basis
    var b = browserify({
        entries: './client.js',
        paths: ['./node_modules', './'],
        cache: {},
        debug: true
    });

    return b.ignore('unicode/category/So')
        .bundle()
        .pipe(source('./asset/built/js/app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(freeze())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./'));
});

gulp.task('css', ['clean'], function() {
    gulp.src([
            './node_modules/bootstrap/scss/bootstrap-flex.scss',
            './node_modules/font-awesome/css/font-awesome.min.css',
            './sass/*.scss'
        ])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(base64({
            baseDir: './',
            maxImageSize: 4096
        }))
        .pipe(freeze())
        .pipe(gulp.dest('./asset/built/css'));
});

gulp.task('copy', ['css'], function() {
    gulp.src('./node_modules/font-awesome/fonts/*.{ttf,woff,woff2,eof,svg}')
        .pipe(gulp.dest('./asset/built/fonts'));
});

gulp.task('inject', ['javascript', 'css'], function() {
    var target = gulp.src('./inject.js');
    var sources = gulp.src(['./asset/built/js/*.js', './asset/built/css/*.css'], { read: false });

    return target.pipe(inject(sources))
        .pipe(gulp.dest('./'));
});

var Watch = {
    bundle: function(file) {
        var b = browserify({
            entries: file,
            paths: ['./node_modules', './'],
            cache: {},
            debug: true
        });
        b.file = file;

        return b;
    },
    build: function(bundle) {
        return bundle.ignore('unicode/category/So')
            .bundle()
            .pipe(source('./asset/built/js/app.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            //.pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./'));
    },
    watch: function(bundle) {
        var w = watchify(bundle, { debug: true });
        w.on('log', gutil.log);
        w.on('time', function(time) {
            gutil.log(gutil.colors.green('Browserify'), bundle.file, gutil.colors.blue('in ' + time + ' ms'));
        });
        w.on('update', Watch.build.bind(null, bundle));
        return w;
    }
};

gulp.task('javascript-watch', ['clean'], function() {
    var streams = ['./client.js'].map(function(file) {
        return Watch.build(Watch.bundle(file));
    });

    return es.merge.apply(null, streams);
});

gulp.task('css-watch', ['clean'], function() {
    gulp.src([
            './node_modules/bootstrap/scss/bootstrap-flex.scss',
            './node_modules/font-awesome/css/font-awesome.min.css',
            './sass/*.scss'
        ])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(base64({
            baseDir: './',
            maxImageSize: 4096
        }))
        .pipe(gulp.dest('./asset/built/css'));
});

gulp.task('css-watch2', function() {
    gulp.src(['./node_modules/bootstrap/scss/bootstrap-flex.scss', './node_modules/font-awesome/css/font-awesome.min.css', './sass/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(base64({
            baseDir: './',
            maxImageSize: 4096
        }))
        .pipe(gulp.dest('./asset/built/css'));
});

gulp.task('inject-watch', ['javascript-watch', 'css-watch'], function() {
    var target = gulp.src('./inject.js');
    var sources = gulp.src(['./asset/built/js/*.js', './asset/built/css/*.css'], { read: false });

    return target.pipe(inject(sources))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', ['clean', 'css-watch', 'javascript-watch', 'inject-watch'], function() {
    gulp.watch('./sass/**/*.scss', ['css-watch2']);

    var streams = ['./client.js'].map(function(file) {
        return Watch.build(Watch.watch(Watch.bundle(file)));
    });

    return es.merge.apply(null, streams);
});

gulp.task('default', ['clean', 'javascript', 'css', 'copy', 'inject']);