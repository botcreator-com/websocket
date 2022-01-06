"use_strict";

import {ContextMenuInteraction} from "discord.js";
import ExtendedClient from "../extendedClient";

export = async (client: ExtendedClient, button: ContextMenuInteraction) => {

    const info = button.id;
    try {

        await console.log(info);

    } catch (err) {

        console.error(err);

    }

};
