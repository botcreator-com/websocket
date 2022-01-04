"strict mode";
import config from "./config.json";
import {Client} from "discord.js";
import {readdirSync, createReadStream} from "fs";
import ms from "ms";
import {join} from "path";
import {blue, green, red} from "colors";
import {text} from "figlet";
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
import {cpus, loadavg, totalmem} from "os";
const guildInvites = new Map();
class ExtendedClient<K, V> extends Client {

    config: any;

    functions: object;

    colors: object;

    guildInvites: Map<K, V>;

    footer: string;

    voc: object;

    myob: object;

    reloadEvent: (relEvent: string) => Promise<unknown>;

    reloadAllEvents: () => Promise<unknown>;

    constructor (tok: string) {

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
        "messageCacheLifetime": require("ms")("1m"),
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
        this.config = config;
        this.functions = {
            "convert": function convert (number: number) {

                const str = String(number),
                    symbol = Math.floor(str.length / 3.00001),
                    numberSymbol = [
                        "",
                        "K",
                        "M",
                        "Md",
                        "B"
                    ];

                let num = str.length % 3,
                    finalNumber = str;


                if (symbol > 0) {

                    if (num === 0) {

                        num = 3;

                    }
                    num += 2;
                    finalNumber = (Number(str.substr(
                        0,
                        num
                    )) / 100).toFixed(2) + numberSymbol[symbol];

                }
                return String(finalNumber).replace(
                    ".00",
                    ""
                );

            },
            "timetrade": function timetrade (time: string | number) {

                let finaltime = 0;
                if (typeof time === "string") {

                    time.split(" ").forEach((timer) => {

                        if (timer.endsWith("y")) {

                            finaltime += ms(`${Number(timer.replace(
                                "y",
                                ""
                            ))}y`);

                        }
                        if (timer.endsWith("w")) {

                            finaltime += ms(`${Number(timer.replace(
                                "w",
                                ""
                            ))}w`);

                        }
                        if (timer.endsWith("d")) {

                            finaltime += ms(`${Number(timer.replace(
                                "d",
                                ""
                            ))}d`);

                        }
                        if (timer.endsWith("h")) {

                            finaltime += ms(`${Number(timer.replace(
                                "h",
                                ""
                            ))}h`);

                        }
                        if (timer.endsWith("m")) {

                            finaltime += ms(`${Number(timer.replace(
                                "m",
                                ""
                            ))}m`);

                        }
                        if (timer.endsWith("s")) {

                            finaltime += ms(`${Number(timer.replace(
                                "s",
                                ""
                            ))}s`);

                        }

                    });
                    return finaltime;

                }
                return require("./functions/parsems")(time);

            }
        };
        this.myob = {};
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

        /**
         * @param {String} relEvent - Event file name without .js
         * @return {Promise<String>}
         */
        this.reloadEvent = function reloadEvent (relEvent: string) {

            return new Promise((resolve) => {

                const files = readdirSync(join(
                    __dirname,
                    "events"
                ));
                files.forEach((e) => {

                    try {

                        const fileName = e.split(".")[0];
                        if (fileName === relEvent) {

                            const file = require(join(
                                __dirname,
                                "events",
                                e
                            ));
                            this.on(
                                fileName,
                                file.bind(
                                    null,
                                    this
                                )
                            );
                            delete require.cache[require.resolve(join(
                                __dirname,
                                "events",
                                e
                            ))];
                            resolve(`> Reloaded \`${relEvent}\``);

                        }

                    } catch (error: any) {

                        throw new Error(`${red("[Events]")} Failed to load event ${e}: ${error.stack || error}`);

                    }

                });
                resolve(`> Event named: \`${relEvent}\` not found`);

            });

        };

        this.reloadAllEvents = function reloadAllEvents () {

            return new Promise((resolve) => {

                let count = 0;
                const files = readdirSync(join(
                    __dirname,
                    "events"
                ));
                files.forEach((e) => {

                    try {

                        count++;
                        const fileName = e.split(".")[0];
                        this.reloadEvent(fileName);

                    } catch (error: any) {

                        throw new Error(`${red("[Events Reload]")} Failed to load event ${e}: ${error.stack || error}`);

                    }

                });
                console.log(`${green("[Events Reload]")} Loaded ${count}/${files.length} events`);
                resolve(`> Reloaded \`${count}\`/\`${files.length}\` events`);

            });

        };
        try {

            this.launch().then(() => {

                console.log(blue("All is launched, Connecting to Discord.."));

            });

        } catch (e: any) {

            throw new Error(e);

        }
        this.login(tok);

    }

    async launch () {

        console.log(blue("G-Bot Start"));
        await this._eventsHandler();
        await this._processEvent();
        await this._startingMessage();

    }

    public _eventsHandler () {

        let count = 0;
        const files = readdirSync(join(
            __dirname,
            "events"
        ));
        files.forEach((e) => {

            try {

                count++;
                const fileName = e.split(".")[0];
                const file = require(join(
                    __dirname,
                    "events",
                    e
                ));
                this.on(
                    fileName,
                    file.bind(
                        null,
                        this
                    )
                );
                delete require.cache[require.resolve(join(
                    __dirname,
                    "events",
                    e
                ))];

            } catch (error: any) {

                throw new Error(`${red("[Events]")} Failed to load event ${e}: ${error.stack || error}`);

            }

        });
        console.log(`${green("[Events]")} Loaded ${count}/${files.length} events`);

    }

    public _startingMessage () {

        const cpuCores = cpus().length;
        // Custom Starting Message
        text(
            "Obvision",
            {
                "font": "Standard"
            },
            (err, data) => {

                if (err) {

                    console.log("Something went wrong...");
                    console.dir(err);
                    return;

                }
                const data2 = data;
                text(
                    "A General Bot for Discord",
                    {
                    },
                    (err2, freeData) => {

                        if (err2) {

                            console.log("Something went wrong...");
                            console.dir(err2);
                            return;

                        }
                        console.log(`================================================================================================================================\n${
                            data2}\n\n${freeData}\n
                            ================================================================================================================================\n
                                CPU: ${(loadavg()[0] / cpuCores).toFixed(2)}% / 100%\n
                                RAM: ${Math.trunc(process.memoryUsage().heapUsed / 1000 / 1000)} MB / ${Math.trunc(totalmem() / 1000 / 1000)} MB
                                Discord WebSocket Ping: ${this.ws.ping}\n
                                ================================================================================================================================`);

                    }
                );

            }
        );

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

export default new ExtendedClient(config.token);

