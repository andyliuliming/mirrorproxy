# Mirror Proxy

the caller (tcp client) => front_proxy(listening on one tcp port) => relay it using the websocket through the azure relay service
=> the end proxy will receive one connection from the azure relay service =>
call the real target endpoint for the caller.