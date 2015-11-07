var http = require('http');
var static = require('node-static');
var fileServer = new static.Server('./public');

http.createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response, function (e, res) {
            if (e && (e.status === 404)) { // If the file wasn't found
                fileServer.serveFile('./public/not-found.html', 404, {}, request, response);
            }
        });
    }).resume();
}).listen(8080);