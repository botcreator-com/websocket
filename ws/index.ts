import { createServer, IncomingMessage } from 'http';
import url from 'url';
import { workerData } from 'worker_threads';
import WebSocket, { WebSocketServer } from 'ws';

const server = createServer(),
    wss = new WebSocketServer({ "noServer": true });

console.log("Server started on port : ", workerData.port);

interface WebSocketAndReq extends WebSocket {
    req?: IncomingMessage
    isAlive?: boolean
}
  
wss.on("connection", (ws: WebSocketAndReq, req) => {
    if (!ws.req) ws.req = req;
    ws.isAlive = true;
    ws.on('pong', function () {
        ws.isAlive = true;
        });
    console.log("New connection", ws.req.headers["cf-connecting-ip"]);
    ws.on("message", (data, isBinary) => {
        if (!isBinary) {
            console.log("Received:", data.toString());
            wss.clients.forEach(function each(client: WebSocketAndReq) {
                if (client.readyState === WebSocket.OPEN && client !== ws) {
                    if (client.req && client.req.url) {
                            const { query } = url.parse(client.req.url, true)
                            if (query.server == "something") {
                                client.send(data, { binary: isBinary });
                            }
                    }
                }
            });
        }
    });
});


const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws: WebSocketAndReq) {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);


wss.on('close', function close() {
    clearInterval(interval);
});

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function done(ws: WebSocketAndReq) {
        ws.req = request;
        wss.emit("connection", ws, request);
    });
}
);
server.listen(workerData.port);
