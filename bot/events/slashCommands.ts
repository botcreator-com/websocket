import {CommandInteraction} from "discord.js";
import ExtendedClient from "../extendedClient";

export default async (client: ExtendedClient, interaction: CommandInteraction) => {

    const command: string = interaction.commandName;
    try {

        await console.log(command);

} catch (err) {

        console.error(err);

}

};
