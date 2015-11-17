var utils = require('utils');
// var casper = require('casper').create({
    // pageSettings: {
        // loadImages:  false,        // The WebPage instance used by Casper will
        // loadPlugins: false         // use these settings
    // },
    // logLevel: 'warning',              // Only "info" level messages will be logged
    // verbose: true                  // log messages will be printed out to the console
// });
var baseUrl = 'http://localhost:3000';
var captureBasedir = 'test/result-capture/';

casper.test.begin('auth & load expenses', function(test) {

    casper.options.logLevel = 'warning';
    casper.options.verbose = true;
    casper.options.javascriptEnabled = true;

    var getUser = function() {
        return this.evaluate(function() {
            return (window.getCurrentUser && window.getCurrentUser()) || {};
        });
    };
    
    casper.on('page.error', function(msg, trace) {
        var info = this.evaluate(function() {
            return {
                appVersion: navigator.appVersion,
                userAgent: navigator.userAgent,
                jsver: window.jsver
            };
        });
        utils.dump(utils.mergeObjects({
            error: 'js error',
            message: msg,
            trace: trace[0]
        }, info));
        //this.die('JS Errors. Fail.', 1);
    });

    casper
        .start(baseUrl, function(response) {

            var info = this.evaluate(function() {
                return {state: document.readyState, jsver: window.jsver};
            });

            //this.echo(this.getTitle() + ' load ' + info.state + (info.jsver ? (' jsVer = ' + info.jsver) : ''), 'INFO');

        });

        
    casper
        .waitForSelector('form.form-signin,.expenses-list', function() {
            this.captureSelector(captureBasedir + '0-form-list.png', 'html');
        });

    casper
        .then(function() {

            var user = getUser.call(this);
            
            if(user.token){
                return;
            }
            
            this.fill('form.form-signin', { 
                email: 'test-user-1',
                password: 'test'
            }, false);

            this.mouseEvent('click', 'form.form-signin button.signIn-button');
            this.mouseEvent('click', 'form.form-signin button.register-button');
        });

    casper
        .waitForSelector('.expenses-list', function() {
            this.captureSelector(captureBasedir + '1-list-load-ok.png', 'html');

        }, function () {
            this.captureSelector(captureBasedir + '1-list-load-fail.png', 'html');

            this.echo(".expenses-list not found\n" + this.getHTML()).exit();
        });

    casper
        .then(function() {

            var user = getUser.call(this);
            
            this.test.assert(!!user.token, 'auth done');

            //this.echo('Authorization: ' + user.token, 'INFO');

            var header = this.evaluate(function() {
                return document.querySelector('.panel-heading h2 span').innerText;
            });
            
            this.test.assertEquals(header, 'Expenses', 'expenses loaded');
        });

    casper
        .run(function(h) {

            test.done();

            this.exit();
        });

});
