var gulp = require('gulp');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('lint', function() {
	return gulp.src('src/Tween.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

gulp.task('min', function() {
	return gulp.src([
		'src/Tween.js'
	])
	.pipe(uglify())
	.pipe(rename('tween.min.js'))
	.pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
	gulp.watch('src/*.js', ['lint', 'min']);
});

gulp.task('default', ['lint', 'min', 'watch']);
