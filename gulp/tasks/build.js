import gulp from 'gulp';
import gulpSequence from 'gulp-sequence';

gulp.task('build', gulpSequence('server', 'html', 'styles', 'images', 'eslint', 'scripts', 'watch'));
