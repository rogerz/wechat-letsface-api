var http = require('http');

exports.createServer = function createServer(port) {
  port = port || 6767;
  var s = http.createServer(function (req, res) {
    s.emit(req.url, req, res);
  });
  s.port = port;
  s.url = 'http://localhost:' + port;
  return s;
};

exports.createGetResponse = function createGetResponse(text, contentType) {
  function getResponse(req, res) {
    contentType = contentType || 'text/plain';
    res.writeHead(200, {'content-type': contentType});
    res.write(text);
    res.end();
  }
  return getResponse;
};
