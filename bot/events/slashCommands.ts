import {Client, CommandInteraction} from "discord.js";


export = async (client: Client, interaction: CommandInteraction) => {

    const command: string = interaction.commandName;

    try {

        await console.log(command);

    } catch (err) {

        console.error(err);

    }

};
