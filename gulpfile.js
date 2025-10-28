const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const fileInclude = require("gulp-file-include");

function htmlTask() {
    return src('app/index.html')
        .pipe(fileInclude({ prefix: "@@", basepath: "@file" }))
        .pipe(dest("dist"))
        .pipe(browserSync.stream());
}

function scssTask() {
    return src("app/scss/style.scss")
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
    return src("app/img/**/*.{jpg,jpeg,png,svg,gif}", { encoding: false })
        .pipe(imagemin())
        .pipe(dest("dist/img"))
        .pipe(browserSync.stream());
}

function jsonTask() {
    return src('app/data-base/data.json')
        .pipe(dest("dist/data-base"))
        .pipe(browserSync.stream());
}

function bootstrapCSS() {
    return src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(dest('dist/css'));
}

function bootstrapJS() {
    return src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(dest('dist/js'));
}

function watchFiles() {
    browserSync.init({
        server: "dist",
    });

    watch("app/*.html", htmlTask).on("change", browserSync.reload);
    watch("app/scss/style.scss", scssTask);
    watch("app/js/*.js", jsTask);
    watch("app/img/*.{jpg,jpeg,png,svg,gif}", imgTask);
    watch("app/data-base/*.json", jsonTask);
}

exports.html = htmlTask;
exports.scss = scssTask;
exports.js = jsTask;
exports.img = imgTask;
exports.bootstrapCSS = bootstrapCSS;
exports.bootstrapJS = bootstrapJS;
exports.json = jsonTask;
exports.default = series(htmlTask, scssTask, jsTask, imgTask, jsonTask, bootstrapCSS, bootstrapJS, watchFiles);
