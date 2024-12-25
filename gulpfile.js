import gulp, { parallel } from 'gulp';
// import less from 'gulp-less';
// import stylus from 'gulp-stylus';
import gulpSass from 'gulp-sass';
import sass from 'sass';
const sassCompiler = gulpSass(sass);
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
// import ts from 'gulp-typescript';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import imagemin from 'gulp-imagemin';
import htmlmin from 'gulp-htmlmin';
import size from 'gulp-size';
import gulppug from 'gulp-pug';
import newer from 'gulp-newer';
import webp from 'gulp-webp';
import browserSync from 'browser-sync';
// import swiper from 'swiper';

const bs = browserSync.create();
import { deleteAsync } from 'del';

const paths = {
    pug: {
        src: 'src/**/*.pug',
        dest: 'dist/'
    },
    html: {
        src: 'src/**/*.html',
        dest: 'dist'
    },
    styles: {
        src: ['src/styles/**/*.sass', 'src/styles/**/*.scss', 'src/styles/**/*.sty1', 'src/styles/**/*.less'],
        dest: 'dist/css/'
    },
    scripts: {
        src: ['src/scripts/**/*.ts', 'src/scripts/**/*.js'],
        dest: 'dist/js/'
    },
    images: {
        src: 'src/img/**/*',
        dest: 'dist/img/'
    }
};

// Задача для очистки
function clean() {
    return deleteAsync(['dist/*', '!dist/img']);
}

function pugTask() {  // Переименовано на pugTask
    return gulp.src(paths.pug.src)
        .pipe(gulppug())  // Используем gulppug
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.pug.dest))
        .pipe(bs.stream());
}

function html() {
    return gulp.src(paths.html.src)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(bs.stream());
}

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        // .pipe(less())
        // .pipe(stylus())
        .pipe(sassCompiler().on('error', sassCompiler.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(bs.stream());
}
function scripts() {
    return gulp.src(['node_modules/swiper/swiper-bundle.js', ...paths.scripts.src])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(bs.stream());
}

function img() {
    return gulp.src(paths.images.src)
        .pipe(newer(paths.images.dest)) // Пропускает файлы, которые не изменились
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(paths.images.dest)) // Сохраняет оригиналы
        .pipe(webp())
        .pipe(gulp.dest(paths.images.dest)) // Сохраняет WebP версии
}


function watch() {
    bs.init({
        server: {
            baseDir: "./dist/"
        }
    });
    gulp.watch(paths.html.dest).on('change', bs.reload);
    gulp.watch(paths.html.src, html);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.images.src, img);
}

// Собираем все задачи в одну
const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch);

// Экспорт задач
export { clean, styles, watch, build, scripts, img, html, pugTask as pug };

// Экспорт по умолчанию
export default build;
