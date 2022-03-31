import { createServer, IncomingMessage } from 'http';
import url from 'url';
import { workerData } from 'worker_threads';
import WebSocket, { WebSocketServer } from 'ws';

const server = createServer(),
    wss = new WebSocketServer({ "noServer": true });

console.log("Server started on port : ", workerData.port);

interface WebSocketAndReq extends WebSocket {
    req?: IncomingMessage
}

wss.on("connection", (ws: WebSocketAndReq, req) => {
    if (!ws.req) ws.req = req;
    console.log("New connection", ws.req.headers["cf-connecting-ip"]);
    ws.on("message", (data) => {
            wss.clients.forEach(function each(client: WebSocketAndReq) {
                if (client.readyState === WebSocket.OPEN && client !== ws) {
                    if (client.req) {
                        if (client.req.url) {
                            const { query } = url.parse(client.req.url, true)
                            if (query.server == "something") {
                                client.send(data);
                            }
                        }
                    }
                }
            });
    });
});

wss.on("close", (ws: WebSocketAndReq) => {
    if(ws.req) {
    console.log("Connection closed", ws.req.headers["cf-connecting-ip"]);
    }
});

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function done(ws: WebSocketAndReq) {
        ws.req = request;
        wss.emit("connection", ws, request);
    });
}
);
server.listen(workerData.port);
