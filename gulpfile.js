var gulp = require('gulp');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var htmlreplace = require('gulp-html-replace');
var concat = require('gulp-concat');

var metadata = require('./package');
var header = '// ' + metadata.name + ' v.' + metadata.version + ' ' + metadata.homepage;

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
