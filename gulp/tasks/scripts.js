import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import gulp from 'gulp';
import gutil from 'gulp-util';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';

import {path} from '../config/path';

gulp.task('scripts', function () {
	return browserify({
        entries    : path.scripts.entry,
        plugins: ['babel-plugin-transform-es2015-for-of'],
        debug      : true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    // .pipe(uglify().on('error', gutil.log))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.scripts.dst))
    .pipe(browserSync.reload({stream: true}));
});
