var express = require('express');
var path = require('path');
var app = express();
var log4js = require('log4js');
var swig = require('swig');
var bodyParser = require('body-parser');


// View engine config
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'html');
app.set('view cache', false);
app.set('views', path.join(__dirname, 'views'));

app.engine('html', swig.renderFile);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

swig.setDefaults({ cache: false });

// log4j config
log4js.configure({
  appenders: [
    { type: 'console' }       //控制台输出
    // {
    //   type: 'file',        //文件输出
    //   filename: 'logs/log.log', 
    //   maxLogSize: 1024,
    //   backups:3,
    //   category: 'normal' 
    // }
  ]
});


var logger = log4js.getLogger('normal');
logger.setLevel('INFO');


app.get('/', function(req, res, next) {
    res.render('index');
});

// Router
app.use('/demo', require('./routes/demo'));

// Server
var server = app.listen(8888, function () {
var host = server.address().address;
var port = server.address().port;
  logger.info('Young app listening at http://%s:%s', host, port);
});

