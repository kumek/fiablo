import gulp from 'gulp';

import {path} from '../config/path';

gulp.task('images', () => {
	return gulp.src(path.images.src)
	.pipe(gulp.dest(path.images.dst));
});