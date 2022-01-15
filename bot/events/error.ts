import {ErrorEvent} from "discord.js";
import ExtendedClient from "../extendedClient";

export default async (client: ExtendedClient, error: ErrorEvent) => {
    await console.log(error);
};
