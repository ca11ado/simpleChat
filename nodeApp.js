var http = require('http');
var static = require('node-static');
var fileServer = new static.Server('./public', { cache: 0 });
var sockjs = require('sockjs');
var sockjsServer = sockjs.createServer();

var server = http.createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response, function (e, res) {
            /*if (e && (e.status === 404)) { // If the file wasn't found
                fileServer.serveFile('./public/not-found.html', 404, {}, request, response);
            }*/
        });
    }).resume();
}).listen(8080);

sockjsServer.installHandlers(server, {prefix:'/websocket', log:sockLog});

sockjsServer.on('connection', function (conn) {
    conn.on('data', function(e) {
        console.log('CONNECTIOIN: data', e);
        //conn.write(message);
    });
    conn.on('close', function(e) {
        console.log('CONNECTIOIN: close', e);
    });
    conn.on('error', function(e) {
        console.log('CONNECTIOIN: error', e);
    });
});

function sockLog(a,b){
    console.log('A',a);
    console.log('B',b);
}