import {Message} from "discord.js";
import ExtendedClient from "../extendedClient";
import Emitter from "../Emitter";
const EventHandler = new Emitter;
EventHandler.on("message",data => {
    console.log(data)
})

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
