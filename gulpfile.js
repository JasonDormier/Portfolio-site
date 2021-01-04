// package vars
const pkg = require("./package.json");

//gulp
const gulp = require("gulp");

const { series } = require("gulp");

const { parallel } = require("gulp");

const runSequence = require("gulp4-run-sequence");

const fs = require("fs");

//loading all of our plug-ins
const $ = require("gulp-load-plugins")({
  pattern: ["*"],
  scope: ["devDependencies"],
});

var gulpIf = require("gulp-if");

const onError = (err) => {
  console.Log(err);
};

//setting up a live sever
gulp.task("browserSync", function () {
  $.browserSync.init({
    server: {
      baseDir: "app",
    },
  });
});

//getting our scss files and combining them together.
gulp.task("sass", function () {
  $.fancyLog("----> compiling sass.");
  return gulp
    .src(pkg.paths.app.scss + pkg.vars.scssName) // Gets all files ending with .scss in app/scss and children dirs
    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.sass().on("error", $.sass.logError)) // Passes it through a gulp-sass, log errors to console'
    .pipe($.autoprefixer())
    .pipe($.concat(pkg.vars.cssName))
    .pipe($.sourcemaps.write("./"))
    .pipe($.size({ gzip: true, showFiles: true }))
    .pipe(gulp.dest(pkg.paths.app.css)) // Outputs it in the css folder
    .pipe($.filter("**/*.css"))
    .pipe(
      $.browserSync.reload({
        stream: true,
      })
    );
});
gulp.task("css", function () {
  runSequence(["sass"]);
  $.fancyLog("-----> Building css");
  return gulp
    .src(pkg.globs.distCss)
    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.newer({ dest: pkg.paths.dist.css + pkg.vars.siteCssName }))
    .pipe($.print())
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.concat(pkg.vars.siteCssName))
    .pipe(
      $.cssnano({
        discardComments: {
          removeAll: true,
        },
        discardDuplicates: true,
        discardEmpty: true,
        minifyFontValues: true,
        minifySelectors: true,
      })
    )
    .pipe($.sourcemaps.write("./"))
    .pipe($.size({ gzip: true, showFiles: true }))
    .pipe(gulp.dest(pkg.paths.dist.css))
    .pipe($.filter("**/*.css"));
});

gulp.task("cssTest", function () {
  runSequence(["sass"]);
  $.fancyLog("-----> Building css");
  return gulp
    .src(pkg.globs.distCss)
    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.print())
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.concat(pkg.vars.cssName))
    .pipe($.sourcemaps.write("./"))
    .pipe($.size({ gzip: true, showFiles: true }))
    .pipe(gulp.dest(pkg.paths.app.css))
    .pipe($.filter("**/*.css"))
    .pipe(
      $.browserSync.reload({
        stream: true,
      })
    );
});

//runSequence(["cssTest", "browserSync"], "watch", callback);

//Gulp Watch reload the process the changes then reload the browser
gulp.task("watch", function () {
  gulp.watch("app/scss/**/*.scss", gulp.series(["cssTest"]));
  gulp.watch("app/css/grid.css", gulp.series($.browserSync.reload));
  gulp.watch("app/*.html", gulp.series($.browserSync.reload));
  gulp.watch("app/js/**/*.js", gulp.series($.browserSync.reload));
});

//taking the js in the html and saving it into js files
//combining the javascript files into one file.
//combining the css files into one file.
gulp.task("useref", function () {
  $.fancyLog("-----> useref Started");
  return gulp
    .src("app/*.html")
    .pipe($.useref())
    .pipe(gulpIf("*.css", $.cssnano()))
    .pipe(gulpIf("*.js", $.uglify()))
    .pipe(gulp.dest("dist"));
});

// Optimizing Images
gulp.task("images", function () {
  $.fancyLog("-----> image optimization");
  return (
    gulp
      .src("app/images/**/*.+(png|jpg|jpeg|gif|svg)")
      // Caching images that ran through imagemin
      .pipe(
        $.cache(
          $.imagemin({
            interlaced: true,
          })
        )
      )
      .pipe(gulp.dest("dist/images"))
  );
});

//placing the fonts in the fonts foloder
gulp.task("fonts", function () {
  $.fancyLog("-----> transfering fonts");
  return gulp.src("app/fonts/**/*").pipe(gulp.dest("dist/fonts"));
});

//cleaning out unneeded files
gulp.task("clean", function () {
  return $.del.sync("dist").then(function (cb) {
    return $.cache.clearAll(cb);
  });
});

gulp.task("clean:dist", function () {
  $.fancyLog("-----> super clean");
  return $.del(["dist/**/*", "!dist/css/**/*", "!dist/images/**/*"]);
});

//build sequences
//-----------------------------
gulp.task("default", function (callback) {
  runSequence(["cssTest", "browserSync"], "watch", callback);
});

gulp.task("build", function (callback) {
  runSequence(
    "clean:dist",
    "css",
    ["useref", "css", "images", "fonts"],
    callback
  );
});
