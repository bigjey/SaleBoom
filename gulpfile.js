var gulp          = require('gulp');
var watch         = require('gulp-watch');

var uglify        = require('gulp-uglify');
var concat        = require('gulp-concat');

var rimraf        = require('gulp-rimraf');
    
var gulpFilter    = require('gulp-filter');
var gulpif        = require('gulp-if');
    
var wiredep       = require('wiredep').stream;
var useref        = require('gulp-useref');
    
    fileinclude   = require('gulp-file-include')

var sass          = require('gulp-sass');

var postcss       = require('gulp-postcss');
var autoprefixer  = require('autoprefixer');
var mqpacker      = require('css-mqpacker');


var spritesmith   = require('gulp.spritesmith');

var merge         = require('merge-stream');

var browserSync   = require('browser-sync').create();
var reload        = browserSync.reload;


var svgSprite     = require('gulp-svg-sprite'); 

var minifyCss     = require('gulp-minify-css');


var path = {
  dev: {
    html: './dev/html/*.html',
    scss: './dev/static/scss/**/*.scss',
    scssIgnore: '!./dev/static/scss/utils/_sprite.scss',
    js: './dev/static/js/**/*.js',
    
    cssFolder: './dev/static/css/',
    wiredepFolder: './dev/html-preview',

    spriteIconFiles: './dev/static/i/icons/*.png',
    spriteCssFolder: './dev/static/scss/utils',
    spriteImageFolder: './dev/static/i',
    spriteCssFile: '_sprite.scss',
    spriteImageFile: '../i/sprite.png'

    /*spriteIconFilesRetina: './dev/static/i/icons/*@2x.png',
    spriteImageFileRetina: 'sprite@2x.png'*/
  },
  build: {
    html: './build/html',
    css: './build/static/css',
    js: './build/static/js',
    img: './build/static/i'
  }
}

// build


gulp.task('css:build', function(){

  var processors = [
    autoprefixer({browsers: ['last 2 versions'], cascade: false})
  ];

  gulp.src('./dev/static/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./build/static/css/'));

})

gulp.task('html:build', function () {
    return gulp.src('./dev/html-preview/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('./build/html/'));
});

gulp.task('move:build', function () {
    gulp.src('./dev/tmp/**/*')
        .pipe(gulp.dest('./build/tmp'))
        
    gulp.src('./dev/static/fonts/**/*')
        .pipe(gulp.dest('./build/static/fonts/'))
        
    gulp.src('./dev/static/i/*')
        .pipe(gulp.dest('./build/static/i/'))
        
    gulp.src('./dev/static/js/*')
        .pipe(gulp.dest('./build/static/js/'))
});

gulp.task('build', [
    'html:build',
    'css:build',
    'move:build'
]);

gulp.task('clean', function(){
  gulp.src( './build/**/*' )
    .pipe( rimraf() );
})


gulp.task('sprite', function () {
  
  var spriteData = gulp.src( path.dev.spriteIconFiles ).pipe(spritesmith({
    
    imgName: path.dev.spriteImageFile,
    cssName: path.dev.spriteCssFile,

    //retinaSrcFilter: [ path.dev.spriteIconFilesRetina ],
    //retinaImgName: path.dev.spriteImageFileRetina,

    cssVarMap: function (sprite) {
      sprite.name = 'icon-' + sprite.name;
    }

  })); 
  
  var imgStream = spriteData.img
    .pipe(gulp.dest( path.dev.spriteImageFolder)); 
  
  var cssStream = spriteData.css
    .pipe(gulp.dest( path.dev.spriteCssFolder ));
   
  return merge(imgStream, cssStream);

});


gulp.task('svg-sprite', function () {

  gulp.src('./dev/static/i/svg/*.svg')
    .pipe(svgSprite({
      shape: {
        spacing: {
            padding: 2
        }
      },
      mode: {
        css: {
          dest: '../',
          sprite: "../i/sprite.svg",
          prefix: '.svg-icon-%s',
          bust: false,
          render: {
            scss: {
              dest: "../scss/utils/_svg_sprite.scss",
              template: "./dev/static/i/svg-sprite-template.scss"
            }
          }
        }
      }
    }))
    .pipe(gulp.dest('./dev/static/i/svg-sprite/'));

});



gulp.task('html', function () {
  
  gulp.src('./dev/html/partial/*.html')
    .pipe( wiredep() )
    .pipe( gulp.dest( './dev/html/partial' ))

  gulp.src( path.dev.html )    
    .pipe( fileinclude({
      prefix: '@@',
      basepath: '@file'
    }) )    
    .pipe( gulp.dest( path.dev.wiredepFolder ) )
    .pipe( reload({stream: true}) );

});


// var processors = [
//   autoprefixer({browsers: ['last 2 versions'], cascade: false}),
//   mqpacker()
// ];

// .pipe( postcss( processors ) )

gulp.task('css', function(){
  
  return gulp.src( path.dev.scss )
    .pipe(sass({outpuyStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest( path.dev.cssFolder ))
    .pipe(browserSync.stream());

});


gulp.task('serve', ['html', 'sprite', 'svg-sprite', 'css'], function(){
  
  browserSync.init({
    notify: false,
    server: {
      baseDir: './' ,
      directory: true
    },
  });


  gulp.watch( path.dev.html, ['html']);
  
  gulp.watch( [path.dev.scss, path.dev.scssIgnore], ['sprite', 'svg-sprite', 'css']);
  
  gulp.watch( path.dev.js, function(){
    reload();
  });

  //watch( path.dev.spriteIconFiles, function(){});  

})
