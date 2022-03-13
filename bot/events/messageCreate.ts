import {Message} from "discord.js";
import ExtendedClient from "../extendedClient";

export default async (client: ExtendedClient, message: Message) => {
    try {
        if (!message.inGuild()){
            await console.log(message.content);
        }
    } catch (err) {
        console.error(
            "error",
            err
        );
    }
};
