+(function(module, require, process, baseDir, console){
'use strict';

var Application = function(port){

  this.port = port || 3000;

  this.init();

  //console.log('app ctor ended');
};

Application.prototype = {
  init: function() {
    this.require();
    this.vars();
    this.initExpress();
    this.sets();
    this.usages();
    this.initRoutes();
    this.initSwagger();
    //this.start();
  },
  vars: function() {
    this.isDebug = process.env.serve === 'gulp';

    this.distrDir = this.path.join(baseDir, '..', 'dist');
    this.staticDir = this.path.join(baseDir, '..', 'webapp');
    this.tmpDir = this.path.join(baseDir, '..', '.tmp');

    this.isDebug && console.log('base dir: ', baseDir);
    this.isDebug && console.log('static dir: ', this.staticDir);
    this.isDebug && console.log('render dir: ', this.distrDir);
  },
  require: function() {
    this.expressEngine = require('express');
    this.compression   = require('compression');
    this.bodyParser    = require('body-parser');
    this.serveStatic   = require('serve-static');
    this.logger        = require('morgan');
    this.path          = require('path');
    this.validator     = require('express-validator');
    this.routes        = require('./routes');
    this.cors          = require('cors');
    this.authentication= require('./lib/authentication');
    this.swaggerTools  = require('swagger-tools');
    this.swaggerApiSpec= require('./api.json');
    //this.cookieSession = require('cookie-session');
    //this.favicon     = require('serve-favicon');
    //this.cookieParser= require('cookie-parser');
  },
  initExpress: function() {
    this.express = this.expressEngine();
    //this.apiPath = this.expressEngine();
  },
  sets: function() {
    this.express.set('views', this.path.join(baseDir, 'views'));
  },
  usages: function() {

    var me = this;
    var compression = this.compression({filter: function shouldCompress(req, res) {
      if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false;
      }

      // fallback to standard filter function
      return me.compression.filter(req, res);
    }});

    //this.express.use(this.favicon(this.staticDir + '/favicon.ico'));
    this.express.use(this.logger(this.isDebug ? 'dev' : 'short'));
    this.express.use(this.validator());
    //this.apiPath.use(this.logger(this.isDebug ? 'dev' : 'short'));
    //this.express.use(this.cookieParser());

    this.express.use(compression);
    //this.express.use(this.cookieSession({ keys: ['8D62B6C1-56BF-472F-840D-5D61CF16928C', 'F0582C8F-D3F1-48C1-8628-1C707525476A'] }));
    this.express.use('/api/', this.cors());
  },
  initRoutes: function() {
    this.isDebug && this.express.use('/', this.expressEngine.static(this.tmpDir, {
      dotfiles: 'ignore',
      etag: true,
      lastModified: true,
      redirect: true
    }));
    this.isDebug && this.express.use('/', this.expressEngine.static(this.staticDir, {
      dotfiles: 'ignore',
      extensions: ['html', 'htm'],
      etag: true,
      index: ['index.html', 'index.htm'],
      lastModified: true,
      redirect: true
    }));
    this.express.use('/', this.expressEngine.static(this.distrDir, {
      dotfiles: 'ignore',
      extensions: ['html', 'htm'],
      etag: true,
      index: ['index.html', 'index.htm'],
      lastModified: true,
      redirect: true
    }));
  },
  initSwagger: function() {
    var _ = this;
    var swaggerToolsConfig = {
      controllers: this.path.join(baseDir, 'api'),
      useStubs: this.isDebug // Conditionally turn on stubs (mock mode)
    };
    console.log('start server http://%s:%s', 'localhost', this.port);

    this.swaggerTools.initializeMiddleware(this.swaggerApiSpec, function (middleware) {

      _.express.use(middleware.swaggerMetadata());
      _.express.use(middleware.swaggerSecurity({
        token: function (req, authOrSecDef, scopesOrApiKey, callback) {
          return _.authentication.checkToken(scopesOrApiKey, req)
            .then(function(currentUser) {

              if(!!currentUser && currentUser.token) {
                return callback();
              }
            })
            .catch(function(error) {
              var result = {message: error, status: 403};
              callback(result);
            });
        }
      }));
      _.express.use(middleware.swaggerRouter(swaggerToolsConfig));
      _.express.use(middleware.swaggerUi({
        swaggerUi: '/api/docs',
        apiDocs: '/api/spec'
      }));

      _.routes.register(_);
    });
  },
  start: function() {
    var _ = this;

    this.server = this.express.listen(_.port, function () {

      var address = _.server.address();
      var host = address.address;
      var port = address.port;

      console.log('app listening at http://%s:%s', host, port);
    });

    process
      .on('SIGINT', function() {
        console.info('Shutting Down Server');
        /*eslint-disable no-process-exit*/
        process.exit(0);
        /*eslint-enable no-process-exit*/
      })
      .on('uncaughtException', function(err) {
        console.error('Exception: ', err);
      });
  }
};

module.exports = Application;

})(module, require, process, __dirname, console, undefined);
