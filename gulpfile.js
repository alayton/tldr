var browserify = require('browserify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var freeze = require('gulp-freeze');
var base64 = require('gulp-base64');
var inject = require('gulp-inject');
var sass = require('gulp-sass');
var gulp = require('gulp');
var del = require('del');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('clean', function() {
    del.sync(['./asset/built/css/*', './asset/built/js/*']);
});

gulp.task('javascript', ['clean'], function() {
    // set up the browserify instance on a task basis
    var b = browserify({
        entries: './client.js',
        debug: true
    });

    return b.ignore('unicode/category/So').bundle()
        .pipe(source('./asset/built/js/app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        // Add transformation tasks to the pipeline here.
        //.pipe(uglify())
        .pipe(freeze())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./'));
});

gulp.task('css', ['clean'], function() {
    gulp.src(['./sass/*.scss', './node_modules/bootstrap/scss/bootstrap-flex.scss', './node_modules/font-awesome/css/font-awesome.min.css'])
        .pipe(sass().on('error', sass.logError))
        .pipe(base64({
            baseDir: './',
            maxImageSize: 4096
        }))
        .pipe(freeze())
        .pipe(gulp.dest('./asset/built/css'));
});

gulp.task('copy', ['css'], function() {
    gulp.src('./node_modules/font-awesome/fonts/*.{ttf,woff,eof,svg}')
        .pipe(gulp.dest('./asset/built/fonts'));
});

gulp.task('inject', ['javascript', 'css'], function() {
    var target = gulp.src('./server.js');
    var sources = gulp.src(['./asset/built/js/*.js', './asset/built/css/*.css'], { read: false });

    return target.pipe(inject(sources))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['clean', 'javascript', 'css', 'copy', 'inject']);