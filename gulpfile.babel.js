import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import gulp from 'gulp';
import gutil from 'gulp-util';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';

const src = './src/';
const dst = './dist/';

export const paths = {
	style: {
		src: [src + 'assets/styles/**.scss', src + 'assets/styles/**.css'],
		dst: dst + 'styles'
	},
	html: {
		src: src + '**/*.html',
		dst: dst
	},
	js: {
		src: [src + 'app/**.*js'],
		dst: dst + 'resources',
		entry: src + 'app/main.js'
	}
}

gulp.task('html', function() {
	return gulp.src(paths.html.src)
	.pipe(rename({dirname: ''}))
	.pipe(gulp.dest(paths.html.dst))
});

gulp.task('scripts', function () {
    var result = browserify({
        entries    : paths.js.entry,
        plugins: ['babel-plugin-transform-es2015-for-of'],
        debug      : true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify().on('error', gutil.log))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.js.dst));
});

gulp.task('build', ['html', 'scripts']);
