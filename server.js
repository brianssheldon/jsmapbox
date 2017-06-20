var express = require('express'),
    app = express(),
    http = require('http'),
    restler = require('restler');
    socketIo = require('socket.io'),
    bodyParser = require('body-parser'),
    pdfmake = require('pdfmake'),
    request = require('request'),
    MBTiles = require('mbtiles');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var server =  http.createServer(app);
var io = socketIo.listen(server);

app.use(express.static(__dirname + '/public'));

app.enable('view cache');

app.get('/', function (req, res) {
	response.redirect("/html/mapboxstuff1.html");
});

app.get("/domapstuff", function(request, response) {
	response.redirect("/html/mapboxstuff1.html");
});

app.get("/domapstuff2", function(request, response) {
	response.redirect("/html/mapboxstuff2.html");
});

// tile cannon
app.get('/getTiles/:s/:z/:x/:y.:t', function(req, res) {

    var thepath = __dirname + '/../' + req.params.s + '.mbtiles';
    console.log('thepath', thepath);

    new MBTiles(thepath, function(err, mbtiles) {

        if (err) {
           console.log("error opening database");
           return res.status(500).send("error opening the database");
        }

        mbtiles.getTile(req.params.z, req.params.x, req.params.y, function(err, tile, headers) {

            if (err) {
                res.set({
                    "Content-Type": "text/plain"
                });
                res.status(404).send('Tile rendering error: ' + err + '\n');
            } else {
                // console.log('getContentType', getContentType(req.params.t));
                res.set(getContentType(req.params.t));
                // console.log('tile', tile);
                res.send(tile);
            }

        });
    });
});

// Set return header
function getContentType(t) {
    var header = {};

    // CORS
    header["Access-Control-Allow-Origin"] = "*";
    header["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept";

    // Cache
    //header["Cache-Control"] = "public, max-age=2592000";

    // request specific headers
    if (t === "png") {
        header["Content-Type"] = "image/png";
    }
    if (t === "jpg") {
        header["Content-Type"] = "image/jpeg";
    }
    if (t === "pbf") {
        header["Content-Type"] = "application/x-protobuf";
        header["Content-Encoding"] = "gzip";
    }

    return header;
}

app.get("*", function(request, response) {
  response.end("404!");
});

console.log('running on 8080');
server.listen(8080);

// ------------------
