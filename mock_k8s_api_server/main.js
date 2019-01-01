var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello I am Super Powerful api server!');
  res.end();
}).listen(443);