const WebSocket = require('hyco-ws');
const readline = require('readline')
  .createInterface({
    input: process.stdin,
    output: process.stdout
  });;

const ns = "andliurelaytest.servicebus.windows.net";
const path = "aaaaaa";
const keyrule = "aaaavw";
const key = "RMMcr1W4x/SXLBvCWrrb0qKCRm5nCpFNqaP6/e4IE6I=";

module.exports = {
  createRelayWSS: function (wssCallback) {
    var uri = WebSocket.createRelaySendUri(ns, path);
    var token = WebSocket.createRelayToken('http://' + ns, keyrule, key);

    var ws = WebSocket.relayedConnect(
      uri,
      token,
      function (wss) {
        console.log('inner relayedConnect callback.');
        wssCallback(wss);
        // readline.on('line', (input) => {
        //     wss.send(input, null);
        // });

        // console.log('Started client interval.');
        // wss.on('close', function () {
        //     console.log('stopping client interval');
        //     process.exit();
        // });
      }
    );
    ws.on('error', function (e) {
      console.log("haha error:"+e)
    })
  }
}
