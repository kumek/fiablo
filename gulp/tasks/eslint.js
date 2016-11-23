import gulp from 'gulp';
import eslint from 'gulp-eslint';

import {path} from '../config/path';

gulp.task('eslint', () => {
	return gulp.src(path.scripts.src)
	.pipe(eslint())
	.pipe(eslint.format())
});
