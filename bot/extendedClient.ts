"strict mode";
import {Client, Options} from "discord.js";
import {readdirSync, createReadStream} from "fs";
import {join} from "path";
import {blue, green, red} from "colors";
import {
    NoSubscriberBehavior,
    StreamType,
    VoiceConnectionStatus,
    createAudioPlayer,
    createAudioResource,
    entersState,
    getVoiceConnection,
    joinVoiceChannel
} from "@discordjs/voice";
const guildInvites = new Map();

/**
 * @extends {Client} Client 
 * @constructor
 * @param { string } token - The token of the bot
 */
class ExtendedClient extends Client {
    colors: object;
    guildInvites: Map<string, object | Map<string, object>>;
    footer: string;
    voc: object;
    constructor (tok: string | undefined) {
        super({"partials": [
            "USER",
            "CHANNEL",
            "GUILD_MEMBER",
            "MESSAGE",
            "REACTION"
        ],
        "allowedMentions": {
            "repliedUser": false
        },
        "failIfNotExists": false,
        "makeCache": Options.cacheWithLimits({
            "MessageManager": 1, // This is default
            "PresenceManager": 0,
            "GuildMemberManager": 0,
            "ThreadManager": 0,
            "ThreadMemberManager": 0,
            "ApplicationCommandManager": 0,
            "GuildInviteManager": 0,
            "GuildBanManager": 0,
            "GuildEmojiManager": 0,
            "GuildScheduledEventManager": 0,
            "GuildStickerManager": 0,
            "BaseGuildEmojiManager": 0,
            "UserManager": 0,
            "ReactionManager": 0,
            "VoiceStateManager": 0,
            "ReactionUserManager": 0,
            "StageInstanceManager": 0            
            // Add more class names here
        }),
        "intents": [
            "GUILDS",
            "GUILD_MEMBERS",
            "GUILD_BANS",
            "GUILD_EMOJIS_AND_STICKERS",
            "GUILD_INTEGRATIONS",
            "GUILD_INVITES",
            "GUILD_VOICE_STATES",
            "GUILD_PRESENCES",
            "GUILD_MESSAGES",
            "GUILD_MESSAGE_REACTIONS",
            "GUILD_MESSAGE_TYPING",
            "DIRECT_MESSAGES",
            "DIRECT_MESSAGE_REACTIONS",
            "DIRECT_MESSAGE_TYPING"
        ]});
        this.guildInvites = guildInvites;
        this.colors = {
            "red": 16711680,
            "green": 32560,
            "default": 3092790 // Discord Color
        };
        this.voc = {
            joinVoiceChannel,
            getVoiceConnection,
            VoiceConnectionStatus,
            entersState,
            createAudioPlayer,
            NoSubscriberBehavior,
            StreamType,
            createAudioResource,
            createReadStream
        };
        this.footer = "MYOB";
        try {
            this.launch().then(() => {
                console.log(blue("All is launched, Connecting to Discord.."));
            });
        } catch (e: any) {
            throw new Error(e);
        }
        this.login(tok);
    }
    async launch (): Promise<void> {
        console.log(blue("A bot is Starting"));
        await this._eventsHandler();
        await this._processEvent();
     }
    public _eventsHandler () {
        let count = 0;
        const files = readdirSync(join(
            __dirname,
            "events"
        ));
        files.forEach(async (e) => {
            try {
                count++;
                const fileName = e.split(".")[0],
                    file = await import(join(
                        __dirname,
                        "events",
                        e
                    ));
                this.on(
                    fileName,
                    file.default.bind(
                        null,
                        this
                    )
                );
            } catch (error: any) {
                throw new Error(`${red("[Events]")} Failed to load event ${e}: ${error.stack || error}`);
            }
        });
        console.log(`${green("[Events]")} Loaded ${count}/${files.length} events`);
    }

    public _processEvent () {
        process.on(
            "unhandledRejection",
            (error: any) => {
                if (error.code === 50007) {
                    return;
                }
                console.error(green("✅ An Error has occured : ") + red(error.stack));
            }
        );
    }
}

export default ExtendedClient;

