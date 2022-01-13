import {Worker} from "worker_threads";
import WebSocket from "ws";
import dotenv from "dotenv";
dotenv.config();
const bot = (port: number) => {

        const worker = new Worker(
            "./dist/bot/index.js",
            {"workerData": {port}}
        );

        worker.on(
            "message",
            (data: string) => {

                console.log(data);

            }
        );

        worker.on(
            "error",
            (error: Error) => {

                console.log(error);

            }
        );
        worker.on(
            "exit",
            (code: number) => {

                if (code !== 0) {

                    console.log(new Error(`Worker stopped with exit code ${code}`));

                }

            }
        );

    },

    webSocket = (port?: number) => {

        const worker = new Worker(
            "./dist/ws/index.js",
            {"workerData": {port}}
        );
        worker.on(
            "message",
            (data: string) => {

                console.log(data);

            }
        );
        worker.on(
            "error",
            (error: Error) => {

                console.log(error);

            }
        );
        worker.on(
            "exit",
            (code: number) => {

                if (code !== 0) {

                    console.log(new Error(`Worker stopped with exit code ${code}`));

                }

            }
        );

    },
    port = process.env.PORT;

if (port) {

    webSocket(parseInt(
        port,
        10
    ));
    bot(parseInt(
        port,
        10
    ));

} else {

    console.log(`Node démarré en déféré (Bot et WebSocket non démarré,
         supposé démarré sur un autre serveur, 
         si ce n'est pas le cas précisé un port`);
    const token: string = process.env.token || "Nothing",
        ws: WebSocket = new WebSocket(`wss://gateway.bot-creator.com/?token=${token}`);
    ws.onopen = () => {

        console.log("Connexion ouverte");

    };
    ws.onerror = (err) => {

        console.log(
            "Connexion fermé pour cause d'erreur.. Fin du processus",
            err
        );
        process.exit(15);

    };

}


