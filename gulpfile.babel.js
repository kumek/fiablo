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

const src = './src/';
const dst = './dist/';

export const paths = {
	style: {
		src: src + 'app/styles/**/*.scss',
		dst: dst + 'resources/styles/'
	},
	html: {
		src: src + '**/*.html',
		dst: dst
	},
	js: {
		src: src + 'app/**/*.js',
		dst: dst + 'resources/styles',
		entry: src + 'app/main.js'
	}
}

gulp.task('styles', function() {
	return gulp.src(paths.style.src)
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
    .pipe(gulp.dest(paths.style.dst));
});

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

gulp.task('build', ['html', 'styles', 'scripts', 'watch']);

gulp.task('watch', function() {
	var watchers = [];
	watchers.push(gulp.watch(paths.style.src, ['styles']));

	watchers.push(gulp.watch([paths.js.src], ['scripts']));

	watchers.forEach(watcher => watcher.on('change', event => {
		console.log(`${event.path}`.green + ' - ' + (event.type === 'deleted' ? `${event.type}`.red : `${event.type}`.yellow));
	}));
})
