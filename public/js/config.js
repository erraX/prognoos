requirejs.config({
  baseUrl: 'js',
  paths: {
    underscore: '../dep/underscore-min',
    jquery: '../dep/jquery.min'
  }
});

requirejs(['app'], function(app) {
  app.start();
});
