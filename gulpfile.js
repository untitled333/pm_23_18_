function defaultTask(cb) {
    // place code for your default task here
    cb();
}

exports.default = defaultTask

const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const fileInclude = require("gulp-file-include");



function htmlTask() {
    return src('app/index.html')
        .pipe(fileInclude({
            prefix: "@@",
            basepath: "@file"
        }))
        .pipe(dest("dist"))
        .pipe(browserSync.stream());
}



function scssTask() {
    return src("app/scss/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(cssnano())
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("dist/css"))
        .pipe(browserSync.stream());
}


function jsTask() {
    return src("app/js/**/*.js")
        .pipe(concat("main.js"))
        .pipe(terser())
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("dist/js"))
        .pipe(browserSync.stream());
}


function imgTask() {
    return src("app/img/**/*.{jpg,jpeg,png,svg,gif}", {encoding: false})
        .pipe(imagemin())
        .pipe(dest("dist/img"))
        .pipe(browserSync.stream());
}

function watchFiles() {
    browserSync.init({
        server: "dist",
    });

    watch("app/*.html", htmlTask);
    watch("app/scss/**/*.scss", scssTask);
    watch("app/js/**/*.js", jsTask);
    watch("app/img/**/*.{jpg,jpeg,png,svg,gif}")
}

exports.html = htmlTask;
exports.scss = scssTask;
exports.js = jsTask;
exports.img = imgTask;

exports.default = series(htmlTask, scssTask, jsTask,imgTask, watchFiles);
