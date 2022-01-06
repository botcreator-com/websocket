
import {blue, green} from "colors";
import fetch from "node-fetch";
import {Collection, Guild, Webhook} from "discord.js";
import ExtendedClient from "../extendedClient";
export default async (client: ExtendedClient) => {

    console.log(`Logged in as ${blue(`${client?.user?.tag}`)}`);
    await client?.user?.setStatus("idle");
    await client?.user?.setActivity("MYOB is Starting...");
    console.log(`${green("[Bot]")} Playing: ${blue("MYOB is Starting...")}`);


    const activities = [
        "MYOB | &help",
        "MYOB"
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

    client.myob.onopen = (): void => {

        console.log("Server Open");
        client.myob.send(JSON.stringify({
            "message": "Guest",
            "system": true,
            "user": client.user,
            "from": "bot"
        }));

    };

    client.myob.onmessage = (data) => {

        if (typeof data.data === "string") {

            const msg = JSON.parse(data.data);
            if (msg.from !== "bot") {

                let channel: any = client?.guilds?.cache.get("919356120466857984")?.channels?.cache?.get("919724869376159764");
                channel?.fetchWebhooks().
                    then((webhooks3: Collection<string, Webhook>) => {

                        const web = webhooks3.filter((e: Webhook) => e.type === "Incoming").first();
                        if (web) {

                            fetch(
                                `https://discord.com/api/webhooks/${web.id}/${web.token}`,
                                {
                                    "method": "post",
                                    "headers": {
                                        "Content-Type": "application/json"
                                    },
                                    "body": JSON.stringify({
                                        "username": `${msg.user.username}#${msg.user.discriminator}`,
                                        "avatar_url": `https://cdn.discordapp.com/avatars/${msg.user.id}/${msg.user.avatar}.png`,
                                        "content": msg.message
                                    })
                                }
                            );

                        } else {

                            channel = client?.guilds?.cache?.get("919356120466857984")?.channels?.cache?.get("919724869376159764");
                            channel.createWebhook(
                                `${msg.user.username}#${msg.user.discriminator}`,
                                {
                                    "avatar": `https://cdn.discordapp.com/avatars/${msg.user.id}/${msg.user.avatar}.png`,
                                    "reason": `Création de webhook par : ${msg.user.username}#${msg.user.discriminator}`
                                }
                            ).
                                then((e: Webhook) => e.send(msg.message));


                        }

                    });

            }

        }

    };

};
