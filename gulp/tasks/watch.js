import gulp from 'gulp';
import colors from 'colors';

import {path} from '../config/path';

gulp.task('watch', () => {
	let watchers = []; 
	gulp.watch(path.style.src, ['styles']);
	gulp.watch(path.scripts.src, ['scripts']);
	gulp.watch(path.images.src, ['images']);

	// watchers.forEach(watcher => watcher.on('change', event => {
	// 	console.log(`${event.path}`.green + ' - ' + (event.type === 'deleted' ? `${event.type}`.red : `${event.type}`.yellow));
	// }));
})