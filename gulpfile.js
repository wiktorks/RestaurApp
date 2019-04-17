let gulp = require('gulp');
let sass = require('gulp-sass');
gulp.task('sass', () => {
    return gulp.src('scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/stylesheets'));
});
gulp.task('watch', () => {
    gulp.watch('scss/**/*.scss', gulp.series('sass'));
});
