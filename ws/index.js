const WebSocket= require('ws');
const { createServer } =  require('http');
const { workerData, parentPort } = require('worker_threads')
const server = createServer();
const wss = new WebSocket.Server({ noServer: true });
console.log("Server started on port : ", workerData.port);

wss.on('connection', function connection(ws, req) {

  console.log("New connection",ws._socket.remoteAddress || req.socket.remoteAddress)
  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});
server.listen(workerData.port || 2000)