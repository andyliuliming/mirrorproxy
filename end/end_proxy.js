var net = require('net');
const WebSocket = require('hyco-ws');

const targetIP = "127.0.0.1";
const targetPort = 443; // target tcp port.


const ns = "andliurelaytest.servicebus.windows.net";
const path = "aaaaaa";
const keyrule = "aaaavw";
const key = "RMMcr1W4x/SXLBvCWrrb0qKCRm5nCpFNqaP6/e4IE6I=";

var wsMask = 1;

var wss = WebSocket.createRelayedServer(
  {
    server: WebSocket.createRelayListenUri(ns, path),
    token: WebSocket.createRelayToken('http://' + ns, keyrule, key)
  },
  function (ws) {
    console.log('connection accepted');

    ws.on('message', function (m, flags) {
      console.log("ws on message");
      console.log(m);
      s.write(m);
    });
    ws.on('close', function () {
      console.log('connection closed');
    });
    var s = net.connect(targetPort, targetIP);
    s.on('close', function (had_error) {
      console.log('s closed.');
    });

    s.on('connect', function () {
      console.log('s connected.');
    });

    s.on('error', function (e) {
      console.log('s error:' + e);
    });

    s.on('data', function (data) {
      console.log("s on data");
      ws.send(data,{binary: true, mask: wsMask});
    });

  });

console.log('listening');

wss.on('error', function (err) {
  console.log('error:' + err);
});