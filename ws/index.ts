import WebSocket, { WebSocketServer } from "ws";
import { createServer } from "http";
import { workerData } from "worker_threads";
const server = createServer(),
    wss = new WebSocketServer({ "noServer": true });

console.log("Server started on port : ", workerData.port);


wss.on("connection", (ws, req) => {
    console.log("New connection", req.headers["x-forwarded-for"]);
    ws.on("message", (data) => {
        console.log(data);
        ws.emit("message", data);

        /*
         *Wss.clients.forEach((client) => {
         *  if (client.readyState === WebSocket.OPEN) {
         *      client.send(data, (err) => console.log(err));
         *  }
         *});
         */
        }
    );
   }
);

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
    });
}
);
server.listen(workerData.port);
