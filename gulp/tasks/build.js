import gulp from 'gulp';
import gulpSequence from 'gulp-sequence';

gulp.task('build', gulpSequence('server', 'html', 'styles', 'eslint', 'scripts', 'watch'));
