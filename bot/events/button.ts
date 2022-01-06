import {InteractionButtonOptions} from "discord.js";
import ExtendedClient from "../extendedClient";


export default async (client: ExtendedClient, button: InteractionButtonOptions) => {


    try {

        await console.log(button.customId);

    } catch (err) {

        console.error(
            "error",
            err
        );

    }

    /*
     *Les lignes ci-dessous seront logger
     */

};
