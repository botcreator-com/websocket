import { blue, green } from "colors";
import { Guild } from "discord.js";
import ExtendedClient from "../extendedClient";
import { WebSocket } from "ws";

export default async (client: ExtendedClient) => {

    console.log(`Logged in as ${blue(`${client?.user?.tag}`)}`);
    await client?.user?.setActivity(`${client.user?.username} is Starting...`);

    console.log(`${green("[Bot]")} Playing: ${blue(`${client.user?.username} is Starting...`)}`);
    
    const activities = [
        "Bot-Creator | Manager",
        "Bot-Creator | Monite you",
        "Bot-Creator don't use any prefix..",
        "Bot-Creator | I'm slash only"
    ], 
    ws = new WebSocket("wss://gateway.bot-creator.com");
    setTimeout(async () => {

        await client?.user?.setActivity(activities[Math.floor(Math.random() * activities.length)]);

    },
    30000)
    
    setInterval(
        async () => {

            await client?.user?.setActivity(activities[Math.floor(Math.random() * activities.length)]);

        },
        120000
    );
   
    ws.onopen = () => {
        ws.send("Connected !");
        setInterval(() => {
            ws.ping(String(Date.now()));
        });
        console.log(`[${client.user?.username}] Connection to WebSocket opened !`);
    };
    ws.onmessage = (data) => {         
        try {
            const JsonRaw = JSON.parse(String(data.data));
            if (JsonRaw.event === "stop"){
                if (JsonRaw.id === client?.user?.id){   
                    client.emit("rawDataFromBotCreator", data.data);
                    client.destroy();
                    process.exit();
                }
            }
        } catch (e){
            client.emit("WebSocketError", e);
        }
    };
    

};
