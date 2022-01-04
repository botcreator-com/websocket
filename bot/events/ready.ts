
import {blue, green} from "colors";
import fetch from "node-fetch";
import WebSocket from "ws";
import {workerData} from "worker_threads";
import {Collection, Guild, Webhook} from "discord.js";
export = async (client: any) => {

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
    client.functions.EOR = function EOR (e: any, message: any) {

        const embed = {
            "author": {
                "name": message.author
                    ? message.author.tag
                    : message.user.tag,
                "icon_url": message.author
                    ? message.author.avatarURL()
                    : message.user.avatarURL()
            },
            "color": "#5e5afc",
            "timestamp": new Date(),
            "footer": {
                "text": "Global Bot",
                "icon_url": client?.user?.avatarURL()
            },
            "fields": [],
            "title": null,
            "description": ""
        };
        if (e.error) {

            if (e.error === "yes") {

                embed.color = "0xf00020";

            } else if (e.error === "no") {

                embed.color = "0x008000";

            }

        }
        if (e.fields) {

            embed.fields = e.fields;

        }
        if (e.title) {

            embed.title = e.title;

        }
        if (e.desc) {

            embed.description = e.desc;

        }
        return embed;

    };

    client.functions.getLastDay = function getLastDay (year: number, month: number) {

        return new Date(
            year,
            month,
            0
        ).getDate();

    };

    client.functions.getDateFromTimestamp = function getDateFromTimestamp (timestamp: number) {

        const date = new Date(timestamp);
        return `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(-2)}-${`0${date.getDate()}`.slice(-2)}`;

    };

    client.myob = new WebSocket(`ws://localhost:${workerData.port}`);
    client.myob.onopen = (): void => {

        console.log("Server Open");
        client.myob.send(JSON.stringify({
            "message": "Guest",
            "system": true,
            "user": client.user,
            "from": "bot"
        }));

    };

    client.myob.onmessage = (data: MessageEvent) => {

        const msg = JSON.parse(data.data);
        if (msg.from !== "bot") {

            client.guilds.cache.get("919356120466857984").channels.cache.get("919724869376159764").fetchWebhooks().
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

                        client.guilds.cache.get("919356120466857984").channels.cache.get("919724869376159764").createWebhook(
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

    };

};
