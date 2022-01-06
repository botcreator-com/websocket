import {Message} from "discord.js";
import ExtendedClient from "../extendedClient";


export default async (client: ExtendedClient, message: Message) => {

    if (message.channel.id === "919724869376159764") {

        if (message.author.bot) {

            return;

        }
        await client?.myob.send(JSON.stringify({
            "message": message.cleanContent,
            "user": message.author,
            "from": "bot"
        }));

    }

};
