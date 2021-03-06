const gulp = require('gulp-help')(require('gulp'));
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const runSequence = require('run-sequence');
const plumber = require('gulp-plumber');
const del = require('del');
const mkdirp = require('mkdirp');
const zip = require('gulp-zip');
const shell = require('gulp-shell');

const firefoxSrc = 'Firefox/src';
const chromeSrc = 'Chrome/src';

const firefoxDist = 'Firefox/dist';
const chromeDist = 'Chrome/dist';

function babelifyJS(src, dest) {
  gulp.src(src)
    .pipe(plumber())
    .pipe(babel({
      compact: false
    }))
    .pipe(gulp.dest(dest));
}

function jsLint(src) {
  return gulp.src(src)
      .pipe(plumber())
      .pipe(eslint())
      .pipe(eslint.format());
}

gulp.task('clean', function(cb) {
  del([firefoxDist, chromeDist], { force: true }, function(err, paths) {
    if (err) {
      console.error('Error', err);
    }
    console.log('Removing\n\t\t', paths.join('\n\t\t'));
    console.log('Creating', firefoxDist);
    mkdirp(firefoxDist, function() {
      console.log('Creating', chromeDist);
        mkdirp(chromeDist, cb);
    });
  });
});

gulp.task('build', ['lint', 'build:firefox', 'build:chrome']);

gulp.task('lint', ['lint:js']);

gulp.task('lint:js', ['lint:js:firefox', 'lint:js:chrome']);

gulp.task('lint:js:firefox', function() {
  return jsLint(firefoxSrc + '/**/*.js');
});

gulp.task('lint:js:chrome', function() {
  return jsLint(chromeSrc + '/**/*.js');
});

gulp.task('build:firefox', function() {
  babelifyJS(firefoxSrc + '/lib/*.js', firefoxDist + '/lib');
  babelifyJS(firefoxSrc + '/data/**/*.js', firefoxDist + '/data');
  babelifyJS(firefoxSrc + '/*.js', firefoxDist);

  return gulp.src(firefoxSrc + '/**/*.{css,gif,html,jsm,json,phtml,png}')
    .pipe(plumber())
    .pipe(gulp.dest(firefoxDist));
});

gulp.task('build:chrome', function() {
  babelifyJS(chromeSrc + '/**/*.js', chromeDist);

  return gulp.src(chromeSrc + '/**/*.{css,gif,html,json,phtml,png}')
    .pipe(plumber())
    .pipe(gulp.dest(chromeDist));
});

gulp.task('watch', function() {
  gulp.watch(firefoxSrc + '/**/*.js', ['lint:js:firefox']);
  gulp.watch(chromeSrc + '/**/*.js', ['lint:js:chrome']);

  gulp.watch(firefoxSrc + '/**/*', ['build:firefox']);
  return gulp.watch(chromeSrc + '/**/*', ['build:chrome']);
});

gulp.task('package', function() {
  gulp.src('')
    .pipe(shell([
      './package-ff.sh'
    ]));
  console.log("============================================");
  console.log("Packaging Grd Me for Chrome");
  console.log("============================================");
  return gulp.src(chromeDist + '/**/*')
          .pipe(zip('Chrome.zip'))
          .pipe(gulp.dest('./'));
});

gulp.task('test', shell.task([
  './test-ff.sh',
]));

gulp.task('default', function() {
  runSequence(
    'clean',
    'build',
    'watch'
  );
});
