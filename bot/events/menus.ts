"use_strict";

import {Client, ContextMenuInteraction} from "discord.js";

export = async (client: Client, button: ContextMenuInteraction) => {

    const info = button.id;
    try {

        await console.log(info);

    } catch (err) {

        console.error(err);

    }

};
