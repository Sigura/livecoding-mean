+(function(require) {
'use strict';

var gulp          = require('gulp');
var sass          = require('gulp-sass');
var connect       = require('gulp-connect');
var $             = require('gulp-load-plugins')();
var bowerFiles    = require('main-bower-files');
//var browserify    = require('browserify');
var babelify      = require('babelify').configure({
  compact: false,
  optional: [
    'es7.asyncFunctions',
    'es7.classProperties',
    'es7.doExpressions',
    'es7.exportExtensions',
    'es7.functionBind',
    'minification.removeConsole',
    'minification.removeDebugger'//,
    //'validation.react'
  ]});
var uglify        = $.uglify();
var browserSync   = require('browser-sync');
var gulpDevServer = require('gulp-develop-server');
var webpack       = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var wds;
var runSequence   = require('run-sequence').use(gulp);
var webpackConfig = require('./webpack.config');
//var touch         = require('touch');
var exec          = require('child_process').exec;
var compiller     = webpack(webpackConfig);
var port          = 5000;
var proxy         = 3000;
var test = {
    /*eslint-disable handle-callback-err*/
    output: function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    },
    /*eslint-enbale handle-callback-err*/
    ui: function() {
        exec('npm run ui-tests', test.output);
    },
    api: function() {
        exec('npm run api-tests', test.output);
    }
};

gulp.task('styles', function () {
    return gulp.src('./webapp/styles/main.css')
        .pipe($.sourcemaps.init())
        .pipe(sass.sync().on('error', sass.logError))
        //.pipe($.autoprefixer('last 1 version'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(connect.reload());
        //.pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('jshint', function () {
    return gulp.src([
        'gulpfile.js',
        'webapp/scripts/**/*.js',
        'nodeapp/**/*.js',
        '!webapp/scripts/components/timepicker.js'
    ])
        .pipe(connect.reload())//browserSync.reload({stream: true, once: true}))
        .pipe($.eslint())
        .pipe($.eslint.format());
        //.pipe($.if(!browserSync.active, $.eslint.failOnError()));
});

gulp.task('html', ['styles'], function () {
    var assets = $.useref.assets({searchPath: ['.tmp', 'webapp', 'dist']});

    assets.on('error', $.util.log);
    uglify.on('error', $.util.log);

    return gulp.src(['webapp/*.html'])
        .pipe(assets)
        //.pipe($.if(['*.js'], uglify))
        .pipe($.if('*.scss', $.sass()))
        .pipe($.if('*.css', $.csso()))
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
        .pipe(gulp.dest('dist'));
});

// gulp-imagemin needed
// gulp.task('images', function () {
    // return gulp.src('webapp/images/**/*')
    // .pipe($.cache($.imagemin({
        // progressive: true,
        // interlaced: true,
        // svgoPlugins: [{cleanupIDs: false}]
    // })))
    // .pipe(gulp.dest('dist/images'));
// });

gulp.task('fonts', function () {
    return gulp.src(bowerFiles({
        filter: '**/*.{eot,svg,ttf,woff,woff2}',
        paths: 'webapp'
    }).concat('webapp/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
    return gulp.src([
        'webapp/*.*',
        '!webapp/*.html'
    ], {
        dot: true
    }).pipe(gulp.dest('dist'));
});

gulp.task( 'server:restart', function() {
    gulpDevServer.restart( function( error ) {
        if( !error ) {
            connect.reload();
        }
    });
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist/*', 'public/*']));

gulp.task('serve', ['styles', 'templates', 'fonts'], function (/*cb*/) {

    gulpDevServer.listen( {
        path: './nodeapp/server.js',
        execArgv: [ '--debug', '--harmony' ],
        verbose: true,
        env: {
          'serve': 'gulp',
          'port': port
        }
    }, function( error ) {
        if( !error ) {
            browserSync({
                notify: false,
                logPrefix: 'BS',
                proxy: 'http://localhost:' + port,
                port: proxy
            });
        }
    } );

    // watch for changes
    gulp.watch( ['./nodeapp/**/*.js'], [ 'server:restart', test.api ] );

    //gulp.watch( ['gulpfile.js'], [ 'styles', 'templates', 'fonts', 'server:restart'/*, test.api, test.ui*/ ] );

    gulp.watch(['webapp/*.html'], ['html', test.ui]);

    gulp.watch('webapp/styles/**/*.css', ['styles', test.ui]);
    gulp.watch('webapp/fonts/**/*', ['fonts']);
    gulp.watch('webapp/scripts/**/*.js', ['templates', test.ui]);
    //gulp.watch('webapp/bower.json', ['wiredep', 'fonts']);
});

gulp.task('bundle', ['jshint'], function () {

    uglify.on('error', $.util.log);

    return gulp.src('webapp/scripts/app.js')
    .pipe($.browserify({
        insertGlobals: false,
        transform: [babelify],
        debug: false
    }))
    .pipe($.stripDebug())
    .pipe(uglify)
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('templates', ['jshint'], function () {

    gulp.src('webapp/scripts/app.js')
    .pipe($.browserify({
        insertGlobals: false,
        transform: [babelify/*, 'reactify'*/],
        debug: true
    }))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(gulp.dest('dist/scripts'));

});

gulp.task('build', ['bundle', 'html', 'fonts', 'extras'/*'images'*/], function () {
    return gulp;//.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('webpack:build-dev', function(callback) {
  return compiller
    .run(function(err, stats) {
      if (err) {
        throw new $.util.PluginError('webpack:build-dev', err);
      }
      $.util.log('[webpack:build-dev]', stats.toString({colors: true}));
      callback();
    });
});

gulp.task('webpack-dev-server', function(callback) {
  //touch.sync('./dist/styles/main.css', {time: new Date(0)});

  wds = new WebpackDevServer(compiller, {
    contentBase: './dist/',
    stats: { colors: true },
    hot: true,
    watchOptions: {aggregateTimeout: 300},
    noInfo: true,
    quiet: false,
    proxy: {
      '*': 'http://localhost:' + port
    }
  });
  wds.listen(proxy, '0.0.0.0', function(err) {
    if (err) {
      throw new $.util.PluginError('gulp-develop-server', err);
    }

    gulpDevServer.listen({
        path: './nodeapp/server.js',
        execArgv: [ '--debug', '--harmony' ],
        verbose: true,
        env: {
          'serve': 'gulp',
          'port': port
        }
    }, function(e) {
      if (e) {
        throw new $.util.PluginError('webpack-dev-server', e);
      }
      $.util.log('[webpack-dev-server]', 'http://localhost:' + proxy);
      return callback();
    });
  });
});

gulp.task('dev', ['html', 'jshint',/*'templates', */ 'extras', 'fonts'/*, 'styles'*/], function (/*cb*/) {
  return runSequence('webpack-dev-server', function() {

    //gulp.start('jshint');
    gulp.watch( ['./nodeapp/**/*.js', './nodeapp/api.json'], [ 'server:restart'/*, test.api*/ ] );

    // gulp.watch( ['gulpfile.js'], [ 'styles', 'templates', 'fonts', 'server:restart'/*, test.api, test.ui*/ ] );

    // gulp.watch(['webapp/*.html'], ['html', test.ui]);

    //gulp.watch('webapp/styles/**/*.css', ['styles']);
    gulp.watch('webapp/fonts/**/*', ['fonts']);
    gulp.watch('webapp/scripts/**/*.js', ['jshint']);
    gulp.watch(['webapp/scripts/**/*.js', '!webapp/scripts/components/**/*.js'], [connect.reload]);
    //gulp.watch('webapp/scripts/**/*.js', ['templates', test.ui]);
  });
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

})(require);
