import { blue, green } from "colors";
import ExtendedClient from "../extendedClient";
import { BroadcastChannel } from "worker_threads";
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
    bc = new BroadcastChannel("Bots");
    setTimeout(async () => {

        await client?.user?.setActivity(activities[Math.floor(Math.random() * activities.length)]);

    },
    30000);
    
    setInterval(
        async () => {

            await client?.user?.setActivity(activities[Math.floor(Math.random() * activities.length)]);

        },
        120000
    );
   

    bc.onmessage = (event: any) => {         
        try {  
            if (event.data.event === "stop"){
                if (event.data.id === client?.user?.id){   
                    client.emit("rawDataFromBotCreator", event.data);
                    client.destroy();
                    process.exit();
                }
            }
        } catch (e){
            client.emit("BroadCastError", e);
        }
    };
    

};
