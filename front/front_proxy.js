
// create one tcp listener.
// will send the content in the tcp through the azure service bus relay.
var net = require('net');
const WebSocket = require('hyco-ws');
var sender = require("./sender")
const lport = 2222; // listen on this port.

var wsMask = 1;

// const readline = require('readline')
//   .createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });;

const ns = "andliurelaytest.servicebus.windows.net";
const path = "aaaaaa";
const keyrule = "aaaavw";
const key = "RMMcr1W4x/SXLBvCWrrb0qKCRm5nCpFNqaP6/e4IE6I=";

// state will hold all about the connections.
function socketHanlders(state, s) {
  var ws = null;

  function flushSocketBuffer() {
    if (state.sBuffer.length > 0) {
      s.write(Buffer.concat(state.sBuffer));
    }
    state.sBuffer = null;
  };

  function flushWebsocketBuffer() {
    if (state.wsBuffer.length > 0) {
      ws.send(Buffer.concat(state.wsBuffer), { binary: true, mask: wsMask });
    }
    state.wsBuffer = null;
  };

  s.on('close', function (had_error) {
    console.log("socket closed.");
    if (ws != null) {
      ws.removeAllListeners('close');
      ws.close()
    }
  });

  s.on('error', function (e) {
    console.log('socket error');
    console.log(e);
    if (ws != null) {
      ws.removeAllListeners('close');
      ws.close();
    }
    s.removeAllListeners('close');
    s.end();
  });

  // s.on('connect', function () {
  state.sReady = true;
  console.log("socket connect.")
  flushSocketBuffer();


  var uri = WebSocket.createRelaySendUri(ns, path);
  var token = WebSocket.createRelayToken('http://' + ns, keyrule, key);

   ws = WebSocket.relayedConnect(
    uri,
    token,
    function (wss) {
      console.log('inner relayedConnect callback.');
      // wssCallback(wss);
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


  console.log("createRelayWSS callback.")
  ws.on('open', function () {
    console.log('ws opened.')

    state.wsReady = true;
    flushWebsocketBuffer();
  });
  ws.on('error', function () {
    console.log('ws error.');
  });
  ws.on('close', function () {
    console.log('ws closed.')
    s.removeAllListeners('close');
    s.end();
  });
  ws.on('message', function (m, flags) {
    if (!state.sReady) {
      state.sBuffer.push(m);
    } else {
      s.write(m);
    }
  });
  console.log('created relay web socket.')
  // ws = wss;
  // });


  s.on('data', function (data) {
    console.log(data.length);
    console.log(data.toString('ascii'));
    if (!state.wsReady) {
      state.wsBuffer.push(data);
    } else {
      console.log("sending the data to ws.");
      ws.send(data, { binary: true, mask: wsMask });
    }
  });
}

// TODO use mutex lock this.
var connectionNumber = 0

function tcp2ws() {
  console.log('proxy mode tcp -> ws');
  console.log('forwarding port ' + lport + " to remote service.");

  // TODO check whether the allowHalfOpen is handled correctly.
  var server = net.createServer(function (s) {
    // var ws = new ws_module(argv.rhost);
    connectionNumber = connectionNumber + 1;
    console.log('connectionNumber==' + connectionNumber);

    var state = {
      sReady: true,
      wsReady: false,
      wsBuffer: [],
      sBuffer: []
    };
    // var state = {
    // 	sReady : true,
    // 	wsReady : false,
    // 	wsBuffer: [],
    // 	sBuffer : []
    // };
    // initSocketCallbacks(state,ws,s);
    socketHanlders(state, s);
  });
  server.listen(lport);
}

tcp2ws()