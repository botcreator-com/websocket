import WebSocket, { WebSocketServer } from "ws";
import { createServer } from "http";
import { workerData } from "worker_threads";
import { IncomingMessage } from "http";
const server = createServer(),
    wss = new WebSocketServer({ "noServer": true });

console.log("Server started on port : ", workerData.port);

interface WebSocketAndReq extends WebSocket{
    req?:IncomingMessage
}

wss.on("connection", (ws: WebSocketAndReq, req) => {
    if(!ws.req) ws.req = req;
    console.log("New connection", ws.req.headers["cf-connecting-ip"]);
    ws.on("message", (data, isBinary) => { 
        if(!isBinary){
            wss.clients.forEach(function each(client: WebSocketAndReq) {
                if (client.readyState === WebSocket.OPEN && client !== ws) {
                    if(client.req){
                        console.log(client.req.url);
                    }
                    client.send(data, { binary: isBinary });
                }
            }); 
        }
    });
}
);

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function done(ws: WebSocketAndReq) {
        ws.req = request;
        console.log(request.url);
        wss.emit("connection", ws, request);
    });
}
);
server.listen(workerData.port);
