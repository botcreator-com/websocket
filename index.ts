import dotenv from "dotenv";
import { Worker, BroadcastChannel } from "worker_threads";
import WebSocket from "ws";
import Database from "./functions/database";
dotenv.config();
interface bot {
    token: string,
    db?: {
        port?: number,
        host?: string,
        name?: string,
        user?: string,
        pass?: string
    }
}
const bot = (globalData: bot) => {
    const worker = new Worker("./dist/bot/index.js", { "workerData": globalData });
    worker.on("message", (data: string) => { console.log(data); });
    worker.on("error", (error: Error) => { console.log(error); });
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
    webSocket(parseInt(port, 10));
    if (process.env.TOKEN) {
        bot({ "token": process.env.TOKEN });
    }
setTimeout(()=>{
 let ws = new WebSocket("wss://gateway.bot-creator.com");
    ws.onopen = () => {
        console.log("WebSocket as started")
        setInterval(() => {
            ws.send(Buffer.from(JSON.stringify({
                event: "ping",
                timestamp: Date.now()
            })))
        }, 1000)
    }
    const bc = new BroadcastChannel("Bots");
    let botList: string[] = [];
    ws.onmessage = async(data) =>{
        try{
            const currentData = JSON.parse(String(data.data));
            if(currentData.id && currentData.event && currentData.token && currentData.baseId){
                console.log("Bot received")
                if(currentData.event === "start" && !botList.includes(currentData.id)){
                    console.log("Bot not in list")
                    botList.push(currentData.id);
                    let db = await Database();
                    if(db){
                      let [DBBot]:any[][] = await db.query(`SELECT * FROM bases WHERE id='${currentData.baseId}'`);
                      if(DBBot.length > 0){
                          console.log("Bot starting...")
                        bot({
                            "token":currentData.token,
                            "db":{
                                "port":3306,
                                "host":DBBot[0].ip,
                                "pass":DBBot[0].pass,
                                "user":DBBot[0].user,
                                "name":DBBot[0].name
                            }
                        })
                      }
                    }
                }
                if(currentData.event === "stop" && botList.includes(currentData.id)){  
                    console.log("Bot stopping..");
                    bc.postMessage(currentData);
                    botList = botList.filter(e => e !== currentData.id);
                }
            }
        
        }catch(e){
            return;
        }
    }

    ws.onclose = () =>{
        console.log("WebSocket closed");
    }
},20000)
   

} else {
    console.log(`Node démarré en déféré (Bot et WebSocket non démarré,
         supposé démarré sur un autre serveur, 
         si ce n'est pas le cas précisé un port`);
    const token: string = process.env.TOKEN || "Nothing",
        ws = new WebSocket(`wss://gateway.bot-creator.com/?token=${token}`),
        heartBeat = function(){
            return setInterval(() => {
                ws.send(Buffer.from(
                    JSON.stringify({
                        "heartBeat": String(`Maintain Connexion...${Math.random()}`)
                            + Date.now()
                    }), "binary"));
            }, 1000);
        };

    ws.onopen = () => {
        console.log("Connexion ouverte");
        if (token !== "Nothing") {
            bot({ token });
        }
        heartBeat();
    };

    ws.onclose = () => {
        clearInterval(heartBeat());
        console.log("Fermeture du WebSocket distant..");
        webSocket(2050);
        console.log("Démarrage du websocket en déféré");
        bot({ token });
    };
}


