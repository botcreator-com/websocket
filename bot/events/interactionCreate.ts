import {Interaction} from "discord.js";
import ExtendedClient from "../extendedClient";

export = async (client: ExtendedClient, data: Interaction) => {

    if (data.isMessageComponent()) {

        if (data.isSelectMenu()) {

            await client.emit(
                "menus",
                data
            );

        } else if (data.isButton()) {

            await client.emit(
                "button",
                data
            );

        }

    } else if (data.isCommand()) {

        await client.emit(
            "slashCommands",
            data
        );

    }

};
