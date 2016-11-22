import gulp from 'gulp';
import browserSync from 'browser-sync';

import {path} from '../config/path';


gulp.task('server', () => {
	browserSync({
		'server': './dist',
	});
})

