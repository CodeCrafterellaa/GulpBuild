
// import gulp from 'gulp';
// import less from 'gulp-less';
// import rename from 'gulp-rename';
// import cleanCSS from 'gulp-clean-css';
// import { deleteAsync } from 'del';

// const paths = {
//     styles: {
//         src: 'src/styles/**/*.less',
//         dest: 'dist/css/'
//     },
//     scripts: {
//         src: 'src/scripts/**/*.js',
//         dest: 'dist/js/'
//     }
// };

// // Задача для очистки
// function clean() {
//     return deleteAsync(['dist/*']);
// }

// // Задача для стилей
// function styles() {
//     return gulp.src(paths.styles.src)
//         .pipe(less())
//         .pipe(cleanCSS())
//         .pipe(rename({
//             basename: 'main',
//             suffix: '.min'
//         }))
//         .pipe(gulp.dest(paths.styles.dest));
// }
// function watch() {
//     gulp.watch(paths.styles.src, styles)
// }
// const build = gulp.series(clean, styles, watch)
// // Экспорт функций
// export { clean, styles, watch };
// exports.build = build
// exports.default = build
import gulp, { parallel } from 'gulp';
import less from 'gulp-less';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import { deleteAsync } from 'del';

const paths = {
    styles: {
        src: 'src/styles/**/*.less',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    }
};

// Задача для очистки
function clean() {
    return deleteAsync(['dist/*']);
}

// Задача для стилей
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest));
}
// Задача для обработки скриптов
function scripts() {
    return gulp.src(paths.scripts.src, {
        sourcemaps: true
    })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest));
}
function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
}

// Собираем все задачи в одну
const build = gulp.series(clean, gulp.parallel(styles, scripts), watch);

// Экспорт задач
export { clean, styles, watch, build, scripts };

// Экспорт по умолчанию
export default build;
