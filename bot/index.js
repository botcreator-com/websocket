"use strict";
"strict mode";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = __importDefault(require("./config.json"));
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const ms_1 = __importDefault(require("ms"));
const path_1 = require("path");
const colors_1 = require("colors");
const figlet_1 = require("figlet");
const voice_1 = require("@discordjs/voice");
const os_1 = require("os");
const guildInvites = new Map();
class ExtendedClient extends discord_js_1.Client {
    constructor(tok) {
        super({ "partials": [
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
            ] });
        this.config = config_json_1.default;
        this.functions = {
            "convert": function convert(number) {
                const str = String(number), symbol = Math.floor(str.length / 3.00001), numberSymbol = [
                    "",
                    "K",
                    "M",
                    "Md",
                    "B"
                ];
                let num = str.length % 3, finalNumber = str;
                if (symbol > 0) {
                    if (num === 0) {
                        num = 3;
                    }
                    num += 2;
                    finalNumber = (Number(str.substr(0, num)) / 100).toFixed(2) + numberSymbol[symbol];
                }
                return String(finalNumber).replace(".00", "");
            },
            "timetrade": function timetrade(time) {
                let finaltime = 0;
                if (typeof time === "string") {
                    time.split(" ").forEach((timer) => {
                        if (timer.endsWith("y")) {
                            finaltime += (0, ms_1.default)(`${Number(timer.replace("y", ""))}y`);
                        }
                        if (timer.endsWith("w")) {
                            finaltime += (0, ms_1.default)(`${Number(timer.replace("w", ""))}w`);
                        }
                        if (timer.endsWith("d")) {
                            finaltime += (0, ms_1.default)(`${Number(timer.replace("d", ""))}d`);
                        }
                        if (timer.endsWith("h")) {
                            finaltime += (0, ms_1.default)(`${Number(timer.replace("h", ""))}h`);
                        }
                        if (timer.endsWith("m")) {
                            finaltime += (0, ms_1.default)(`${Number(timer.replace("m", ""))}m`);
                        }
                        if (timer.endsWith("s")) {
                            finaltime += (0, ms_1.default)(`${Number(timer.replace("s", ""))}s`);
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
            joinVoiceChannel: voice_1.joinVoiceChannel,
            getVoiceConnection: voice_1.getVoiceConnection,
            VoiceConnectionStatus: voice_1.VoiceConnectionStatus,
            entersState: voice_1.entersState,
            createAudioPlayer: voice_1.createAudioPlayer,
            NoSubscriberBehavior: voice_1.NoSubscriberBehavior,
            StreamType: voice_1.StreamType,
            createAudioResource: voice_1.createAudioResource,
            createReadStream: fs_1.createReadStream
        };
        this.footer = "MYOB";
        /**
         * @param {String} relEvent - Event file name without .js
         * @return {Promise<String>}
         */
        this.reloadEvent = function reloadEvent(relEvent) {
            return new Promise((resolve) => {
                const files = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, "events"));
                files.forEach((e) => {
                    try {
                        const fileName = e.split(".")[0];
                        if (fileName === relEvent) {
                            const file = require((0, path_1.join)(__dirname, "events", e));
                            this.on(fileName, file.bind(null, this));
                            delete require.cache[require.resolve((0, path_1.join)(__dirname, "events", e))];
                            resolve(`> Reloaded \`${relEvent}\``);
                        }
                    }
                    catch (error) {
                        throw new Error(`${(0, colors_1.red)("[Events]")} Failed to load event ${e}: ${error.stack || error}`);
                    }
                });
                resolve(`> Event named: \`${relEvent}\` not found`);
            });
        };
        this.reloadAllEvents = function reloadAllEvents() {
            return new Promise((resolve) => {
                let count = 0;
                const files = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, "events"));
                files.forEach((e) => {
                    try {
                        count++;
                        const fileName = e.split(".")[0];
                        this.reloadEvent(fileName);
                    }
                    catch (error) {
                        throw new Error(`${(0, colors_1.red)("[Events Reload]")} Failed to load event ${e}: ${error.stack || error}`);
                    }
                });
                console.log(`${(0, colors_1.green)("[Events Reload]")} Loaded ${count}/${files.length} events`);
                resolve(`> Reloaded \`${count}\`/\`${files.length}\` events`);
            });
        };
        try {
            this.launch().then(() => {
                console.log((0, colors_1.blue)("All is launched, Connecting to Discord.."));
            });
        }
        catch (e) {
            throw new Error(e);
        }
        this.login(tok);
    }
    launch() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log((0, colors_1.blue)("G-Bot Start"));
            yield this._eventsHandler();
            yield this._processEvent();
            yield this._startingMessage();
        });
    }
    _eventsHandler() {
        let count = 0;
        const files = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, "events"));
        files.forEach((e) => {
            try {
                count++;
                const fileName = e.split(".")[0];
                const file = require((0, path_1.join)(__dirname, "events", e));
                this.on(fileName, file.bind(null, this));
                delete require.cache[require.resolve((0, path_1.join)(__dirname, "events", e))];
            }
            catch (error) {
                throw new Error(`${(0, colors_1.red)("[Events]")} Failed to load event ${e}: ${error.stack || error}`);
            }
        });
        console.log(`${(0, colors_1.green)("[Events]")} Loaded ${count}/${files.length} events`);
    }
    _startingMessage() {
        const cpuCores = (0, os_1.cpus)().length;
        // Custom Starting Message
        (0, figlet_1.text)("Obvision", {
            "font": "Standard"
        }, (err, data) => {
            if (err) {
                console.log("Something went wrong...");
                console.dir(err);
                return;
            }
            const data2 = data;
            (0, figlet_1.text)("A General Bot for Discord", {}, (err2, freeData) => {
                if (err2) {
                    console.log("Something went wrong...");
                    console.dir(err2);
                    return;
                }
                console.log(`================================================================================================================================\n${data2}\n\n${freeData}\n
                            ================================================================================================================================\n
                                CPU: ${((0, os_1.loadavg)()[0] / cpuCores).toFixed(2)}% / 100%\n
                                RAM: ${Math.trunc(process.memoryUsage().heapUsed / 1000 / 1000)} MB / ${Math.trunc((0, os_1.totalmem)() / 1000 / 1000)} MB
                                Discord WebSocket Ping: ${this.ws.ping}\n
                                ================================================================================================================================`);
            });
        });
    }
    _processEvent() {
        process.on("unhandledRejection", (error) => {
            if (error.code === 50007) {
                return;
            }
            console.error((0, colors_1.green)("✅ An Error has occured : ") + (0, colors_1.red)(error.stack));
        });
    }
}
exports.default = new ExtendedClient(config_json_1.default.token);
