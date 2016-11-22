import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import concat from 'gulp-concat';
import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';

import {path} from '../config/path';

gulp.task('styles', () => {
	return gulp.src(path.style.src)
	.pipe(plumber({
		 errorHandler: err => {
		 	const prompt = `[${err.plugin.yellow}] - `;
		 	console.log();

		 	//Print place of error
		 	let tmpPath = err.relativePath.split('/');
		 	tmpPath[tmpPath.length-1] = tmpPath[tmpPath.length-1].white;
		 	tmpPath = tmpPath.join('/');
		 	console.log(prompt + 'Error'.bgRed.white + ' on file ' + tmpPath + `:(${err.line},${err.column})`.bold.white);

		 	//Print error message
		 	var whiteMode = false;
		 	console.log(prompt + err.messageOriginal.split(' ').map(word => {
		 		if (word === 'was') {
		 			return word.red;
		 		}

		 		if (whiteMode) {
		 			return word.white;
		 		}

		 		if (word === 'expected') {
		 			whiteMode = true;
		 			return word.green;
		 		}
		 		return word;
		 	}).join(' '));

		 	console.log();
		 }
	}))
    .pipe(sourcemaps.init())
    .pipe(sass({
        errLogToConsole: true
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.style.dst))
    .pipe(browserSync.reload({stream: true}));
});