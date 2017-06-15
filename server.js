var express = require('express'),
    app = express(),
    http = require('http'),
    restler = require('restler');
    socketIo = require('socket.io'),
    fabric = require('fabric').fabric,
    handlebars = require('express-handlebars'),
    bodyParser = require('body-parser'),
    pdfmake = require('pdfmake'),
    request = require('request');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var server =  http.createServer(app);
var io = socketIo.listen(server);

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     console.log("---- chat message: '", msg, "'");
//     io.emit('chat message2', msg);
//   });
//
//   socket.on('updateStuff', function(msg){
//     console.log("---- updateStuff: '", msg, "'");
//     io.emit('updateRmmConfigClient', msg);
//   });
// });

var hbs = handlebars.create({
    defaultLayout: 'main',
	helpers: {
        foo: function () { return 'FOO!'; },
        bar: function () { return 'BAR!'; }
    },
    partialsDir: [
        // 'shared/templates/',
        'views/partials/'
    ]
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.enable('view cache');

app.get('/', function (req, res) {
    res.render('home', {
        title: 'Home'
    });
});

// ----------------------------------------------------------


app.get("/domapstuff", function(request, response) {
	response.redirect("/html/mapboxstuff1.html");
});

app.get("/domapstuff2", function(request, response) {
	response.redirect("/html/mapboxstuff2.html");
});

app.get("*", function(request, response) {
  response.end("404!");
});


server.listen(8080);

// ------------------
