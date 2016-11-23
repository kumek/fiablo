import gulp from 'gulp';
import rename from 'gulp-rename';

import {path} from '../config/path';
gulp.task('html', () => {
	return gulp.src(path.html.src)
	.pipe(rename({dirname: ''}))
	.pipe(gulp.dest(path.html.dst))
});
