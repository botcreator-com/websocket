import { blue, green } from "colors";
import { Guild } from "discord.js";
import ExtendedClient from "../extendedClient";
export default async (client: ExtendedClient) => {

    console.log(`Logged in as ${blue(`${client?.user?.tag}`)}`);
    await client?.user?.setActivity("Bot-Creator is Starting...");
    console.log(`${green("[Bot]")} Playing: ${blue("Bot-Creator is Starting...")}`);
    const activities = [
        "Bot-Creator | Manager",
        "Bot-Creator | Monite you",
        "Bot-Creator don't use any prefix..",
        "Bot-Creator | I'm slash only"
    ];
    setInterval(
        async () => {

            await client?.user?.setActivity(activities[Math.floor(Math.random() * activities.length)]);

},
        120000
    );
    client.guilds.cache.forEach((guild: Guild) => {

        if (guild?.me?.permissions.has("MANAGE_GUILD")) {

            guild.invites.fetch().then((invites) => client?.guildInvites?.set(
                guild.id,
                invites
            )).
                catch((err) => {

                    Error(err);

});

}

});

};
