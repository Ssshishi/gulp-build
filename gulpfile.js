var gulp = require("gulp")
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const cleanCss = require('gulp-clean-css');
const htmlMin = require('gulp-htmlmin');
const livereload = require('gulp-livereload');
const connect = require('gulp-connect');
const runSequence = require('gulp4-run-sequence');


// 合并js文件
gulp.task('js', function () {
  return gulp.src('src/js/**/*.js') // 读取数据到gulp内存中
    .pipe(concat('built.js'))
    .pipe(gulp.dest('dist/js/'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js/')) 
    .pipe(connect.reload()) //实时刷新下
})

gulp.task('less', function () {
  return gulp.src('src/less/*.less')
    .pipe(less()) // less  -> css
    .pipe(gulp.dest('src/css/'))
    .pipe(connect.reload())
})

gulp.task('css', function () { // 先完成less 后再执行
  return gulp.src('src/css/*.css')
    .pipe(concat('built.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css/'))
    .pipe(connect.reload()) //实时刷新下
})

gulp.task('html', function () {
  return gulp.src('index.html')
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload()) //实时刷新下
})

gulp.task('server', done => {
  connect.server({
    root: './dist',
    livereload: true
  })
  done()
})



gulp.task('watch', () => {
  gulp.watch('./src/less/test3.less', gulp.series('js', 'less', 'css', 'html'));
  gulp.watch('./src/css/*.css', gulp.series('js', 'css', 'html'));
  gulp.watch('./src/js/*.js', gulp.series('js','html'));
  gulp.watch('./index.html', gulp.series('html'));
})

gulp.task('default', (done) => {
  runSequence('js', ['less', 'css'], 'html','server', 'watch', done)
});