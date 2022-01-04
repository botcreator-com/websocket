import {Client, InteractionButtonOptions} from "discord.js";


export = async (client: Client, button: InteractionButtonOptions) => {


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
