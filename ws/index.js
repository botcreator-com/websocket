"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importStar(require("ws"));
const http_1 = require("http");
const worker_threads_1 = require("worker_threads");
const server = (0, http_1.createServer)(), wss = new ws_1.WebSocketServer({ "noServer": true });
console.log("Server started on port : ", worker_threads_1.workerData.port);
wss.on("connection", (ws, req) => {
    console.log("New connection", req.socket.remoteAddress);
    ws.on("message", (data, isBinary) => {
        wss.clients.forEach((client) => {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(data, { "binary": isBinary });
            }
        });
    });
});
server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, () => {
        wss.emit("connection", socket, request);
    });
});
server.listen(worker_threads_1.workerData.port);
