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

function htmlTask() {
    return src("app/*.html")
        .pipe(dest("dist"))
        .pipe(browserSync.stream());
}


function scssTask() {
    return src("app/scss/**/*.scss")      // всі SCSS файли
        .pipe(sass().on("error", sass.logError)) // компіляція SCSS у CSS
        .pipe(cssnano())                   // мінімізація
        .pipe(rename({ suffix: ".min" })) // style.min.css
        .pipe(dest("dist/css"))            // зберігаємо в dist/css
        .pipe(browserSync.stream());       // оновлення браузера
}


function jsTask() {
    return src("app/js/**/*.js")         // беремо всі JS з app/js
        .pipe(concat("main.js"))           // об’єднуємо в один
        .pipe(terser())                    // мінімізуємо
        .pipe(rename({ suffix: ".min" }))  // додаємо .min
        .pipe(dest("dist/js"))        // зберігаємо лише мінімізований
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

exports.default = series(htmlTask, scssTask, jsTask, imgTask, watchFiles);
