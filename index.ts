import dotenv from "dotenv";
import { Worker } from "worker_threads";
import WebSocket from "ws";
dotenv.config();
interface bot {
    token: string
}
const bot = (globalData: bot) => {
    const worker = new Worker( "./dist/bot/index.js", { "workerData": globalData } );
    worker.on( "message", (data: string) => { console.log(data); } );
    worker.on( "error", (error: Error) => { console.log(error); } );
    worker.on("exit", (code: number) => {
        if (code !== 0) {
            console.log(new Error(`Worker stopped with exit code ${code}`));
        }
    }
    );
},

    webSocket = (port?: number) => {
        const worker = new Worker("./dist/ws/index.js", { "workerData": { port } });
        worker.on("message", (data: string) => { console.log(data); });
        worker.on("error", (error: Error) => { console.log(error); });
        worker.on("exit", (code: number) => { 
            if (code !== 0) { 
                console.log(new Error(`Worker stopped with exit code ${code}`)); 
            } 
        });
    },
    port = process.env.PORT;

if (port) {
    webSocket(parseInt( port, 10 ));
    if (process.env.TOKEN) {
        bot({ "token": process.env.TOKEN });
    }
} else {
    console.log(`Node démarré en déféré (Bot et WebSocket non démarré,
         supposé démarré sur un autre serveur, 
         si ce n'est pas le cas précisé un port`);
    const token: string = process.env.TOKEN || "Nothing",
        ws: WebSocket = new WebSocket(`wss://gateway.bot-creator.com/?token=${token}`),
        heartBeat: NodeJS.Timer = setInterval( () => {
                ws.send(Buffer.from( 
                    JSON.stringify({ "heartBeat": String(`Maintain Connexion...${Math.random()}`)
                     + Date.now() 
                    }), "binary" ));
            }, 1000 );

    ws.onopen = () => {
        console.log("Connexion ouverte");
        if (token !== "Nothing") {
            bot({ token });
        }
    };


    ws.onerror = (err) => {
        console.log( "Une erreur c'est produite", err );
    };

    ws.onclose = () => {
        clearInterval(heartBeat);
        console.log("Fermeture du WebSocket distant..");
        webSocket(2050);
        console.log("Démarrage du websocket en déféré");
        bot({ token });
    };
}


