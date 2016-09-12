const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const watch = require('gulp-watch');

const LessAutoprefix = require('less-plugin-autoprefix');
const autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
 

gulp.task('es6', function(){
    return gulp.src('src/js/*.js')
	.pipe(sourcemaps.init())
    .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'))
	.pipe(uglify())
	.pipe(sourcemaps.write('.'))
        .pipe(rename('fnn-autocomplete.min.js'))
        .pipe(gulp.dest('dist'))
});


gulp.task('less', function () {
    return gulp.src('src/less/*.less')
	.pipe(sourcemaps.init())
        .pipe(less({
    		plugins: [autoprefix]
  	 }))
	//.pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'))
	.pipe(sourcemaps.init())
	.pipe(cleanCSS())
	.pipe(sourcemaps.write('.'))
        .pipe(rename('fnn-autocomplete.min.css'))
        .pipe(gulp.dest('dist'))
});




gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['es6']);
	gulp.watch('src/**/*.less', ['less']);
});



