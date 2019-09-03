var gulp =            require('gulp'),
    browserSync =     require('browser-sync').create(),
    sass =            require('gulp-sass'),
    uglify =          require('gulp-uglify'),
    autoprefixer =    require('gulp-autoprefixer'),
    cleanCSS =        require('gulp-clean-css'),
    imagemin =        require('gulp-imagemin'),
    nunjucksRender =  require('gulp-nunjucks-render'),
    concat =          require('gulp-concat'),
    htmlmin =         require('gulp-htmlmin');

// Static Server + watching scss/html files.
gulp.task('serve', ['compressJs', 'sass', 'nunjucks-html-watch'], function() {
    browserSync.init({
        server: '../var2019',
        browser: "google chrome"
    });

    gulp.watch('js/*.js', ['compressJs']);
    gulp.watch('css/*.scss', ['sass']);
    gulp.watch('./**/*.html', ['nunjucks-html-watch'])
});

gulp.task('sass', function() {
    return gulp.src('css/style.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('../var2019/css'))
        .pipe(browserSync.stream());
});

gulp.task('compressJs', function () {
    return gulp.src('js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('../var2019/js'))
        .pipe(browserSync.stream());
});

gulp.task('compressImage', function () {
    return gulp.src('img/**')
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 3
        }))
        .pipe(gulp.dest('../var2019/img'))
});

gulp.task('nunjucks', function() {
  return gulp.src('pages/**/*.+(html|nunjucks)')
    .pipe(nunjucksRender({
      path: ['templates']
    }))
    .pipe(htmlmin(
      {
        collapseWhitespace: true,
        removeComments: true
      }))
    .pipe(gulp.dest('../var2019'))
});

// Create a task that ensures the `nunjucks` task is complete before reloading browsers.
gulp.task('nunjucks-html-watch', ['nunjucks'], function () {
  browserSync.reload();
});

// gulp.task('vendors-scripts', function() {
//   return gulp.src([
//       './node_modules/jquery/dist/jquery.min.js',
//       './node_modules/jquery/dist/jquery.min.js'])
//     .pipe(concat('vendors.js'))
//     .pipe(gulp.dest('build/js/'));
// });

// gulp.task('copy-files', function() {
//   gulp.src([
//     'config/web.config'
//   ])
//   .pipe(gulp.dest('build'));
// });

// Compile project.
// gulp.task('build-project', ['sass', 'compressImage', 'compressJs', 'nunjucks', 'vendors-scripts', 'copy-files']);
gulp.task('build-project', ['sass', 'compressImage', 'compressJs', 'nunjucks']);

// Compile and start project.
gulp.task('default', ['build-project', 'serve']);
