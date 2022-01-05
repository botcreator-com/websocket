"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const bot = (port) => {
    const worker = new worker_threads_1.Worker("./bot/index.js", { "workerData": { port } });
    worker.on("message", (data) => {
        console.log(data);
    });
    worker.on("error", (error) => {
        console.log(error);
    });
    worker.on("exit", (code) => {
        if (code !== 0) {
            console.log(new Error(`Worker stopped with exit code ${code}`));
        }
    });
}, webSocket = (port) => {
    const worker = new worker_threads_1.Worker("./ws/index.js", { "workerData": { port } });
    worker.on("message", (data) => {
        console.log(data);
    });
    worker.on("error", (error) => {
        console.log(error);
    });
    worker.on("exit", (code) => {
        if (code !== 0) {
            console.log(new Error(`Worker stopped with exit code ${code}`));
        }
    });
};
webSocket(parseInt(process.argv[2], 10));
bot(parseInt(process.argv[2], 10));
