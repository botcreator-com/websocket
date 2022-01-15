import {blue, green} from "colors";
import {Guild} from "discord.js";
import ExtendedClient from "../extendedClient";
export default async (client: ExtendedClient) => {

    console.log(`Logged in as ${blue(`${client?.user?.tag}`)}`);
    await client?.user?.setStatus("idle");
    await client?.user?.setActivity("MYOB is Starting...");
    console.log(`${green("[Bot]")} Playing: ${blue("MYOB is Starting...")}`);


    const activities = [
        "MYOB | &help",
        "MYOB"
    ],
        heartBeat: NodeJS.Timer = setInterval(
            () => {

                client.myob.send(Buffer.from(
                    JSON.stringify({
                        "heartBeat": String(`Maintain Connexion...${Math.random()}`) + Date.now()
                    }),
                    "binary"
                ));

            },
            1000
        );


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
    client.myob.onopen = (): void => {

        console.log("Server Open");


    };

    client.myob.onmessage = (data) => {

        console.log(data.data);

    };

    client.myob.onclose = () => {

        clearInterval(heartBeat);

    };

};
