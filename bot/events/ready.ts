import { blue, green } from "colors";
import { Guild } from "discord.js";
import ExtendedClient from "../extendedClient";
import { WebSocket } from "ws";
export default async (client: ExtendedClient) => {

    console.log(`Logged in as ${blue(`${client?.user?.tag}`)}`);
    await client?.user?.setActivity(client.user?.username + " is Starting...");
    if(client.WS.readyState === 3 || client.WS.readyState === 2){
        client.WS = new WebSocket("wss://gateaway.bot-creator.com");
    }
    client.WS.onopen = () => {
        client.WS.send("Connected !")
        setInterval(()=>{
            client.WS.ping(String(Date.now()))
        })
        console.log(`[${client.user?.username}] Connection to WebSocket opened !`)
    }
    client.WS.onmessage = (event) => {
        console.log(event.data);
    }
    console.log(`${green("[Bot]")} Playing: ${blue(client.user?.username + " is Starting...")}`);
    const activities = [
        "Bot-Creator | Manager",
        "Bot-Creator | Monite you",
        "Bot-Creator don't use any prefix..",
        "Bot-Creator | I'm slash only"
    ];
    setInterval(
        async () => {

            await client?.user?.setActivity(activities[Math.floor(Math.random() * activities.length)]);

},
        120000
    );
    client.guilds.cache.forEach((guild: Guild) => {

        if (guild?.me?.permissions.has("MANAGE_GUILD")) {

            guild.invites.fetch().then((invites) => client?.guildInvites?.set(
                guild.id,
                invites
            )).
                catch((err) => {

                    Error(err);

});

}

});

};
