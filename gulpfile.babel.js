import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import gulp from 'gulp';
import gutil from 'gulp-util';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import colors from 'colors';
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import plumber from 'gulp-plumber';
import changed from 'gulp-change';
import eslint from 'gulp-eslint';
import browserSync from 'browser-sync';

import {path} from './gulp/config/path';

import'./gulp/';

gulp.task('html', () => {
	return gulp.src(path.html.src)
	.pipe(rename({dirname: ''}))
	.pipe(gulp.dest(path.html.dst))
});

gulp.task('eslint', () => {
	return gulp.src(path.scripts.src)
	.pipe(eslint())
	.pipe(eslint.format())
});

