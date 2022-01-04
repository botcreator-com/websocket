import {Client, ErrorEvent} from "discord.js";


export = async (client: Client, error: ErrorEvent) => {

    await console.log(error);

};
