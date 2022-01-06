import WebSocket, {WebSocketServer} from "ws";
import {createServer} from "http";
import {workerData} from "worker_threads";
const server = createServer(),
    wss = new WebSocketServer({"noServer": true});

console.log(
    "Server started on port : ",
    workerData.port
);

wss.on(
    "connection",
    (ws: WebSocket, req: any) => {

        console.log(
            "New connection",
            req.socket.remoteAddress
        );
        ws.on(
            "message",
            (data: WebSocketEventMap, isBinary: boolean) => {

                wss.clients.forEach((client) => {

                    if (client.readyState === WebSocket.OPEN) {

                        client.send(
                            data,
                            {"binary": isBinary}
                        );

                    }

                });

            }
        );

    }
);

server.on(
    "upgrade",
    (request, socket, head) => {

        wss.handleUpgrade(
            request,
            socket,
            head,
            () => {

                wss.emit(
                    "connection",
                    socket,
                    request
                );

            }
        );

    }
);
server.listen(workerData.port);
