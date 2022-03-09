import WebSocket, { WebSocketServer } from "ws";
import { createServer } from "http";
import { workerData } from "worker_threads";
const server = createServer(),
    wss = new WebSocketServer({ "noServer": true });

console.log("Server started on port : ", workerData.port);


wss.on("connection", (ws: WebSocket, req) => {
    console.log("New connection", req.headers["x-forwarded-for"]);
    ws.on("message", (data, isBinary) => { 
        console.log(data);
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN && client !== ws) {
                client.send(data, { binary: isBinary });
               
            }
        });
    });
}
);

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function done(ws: WebSocket) {
        wss.emit("connection", ws, request);
    });
}
);
server.listen(workerData.port);
