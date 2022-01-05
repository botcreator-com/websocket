"use strict";
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
const colors_1 = require("colors");
const node_fetch_1 = __importDefault(require("node-fetch"));
const ws_1 = __importDefault(require("ws"));
const worker_threads_1 = require("worker_threads");
module.exports = (client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    console.log(`Logged in as ${(0, colors_1.blue)(`${(_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.tag}`)}`);
    yield ((_b = client === null || client === void 0 ? void 0 : client.user) === null || _b === void 0 ? void 0 : _b.setStatus("idle"));
    yield ((_c = client === null || client === void 0 ? void 0 : client.user) === null || _c === void 0 ? void 0 : _c.setActivity("MYOB is Starting..."));
    console.log(`${(0, colors_1.green)("[Bot]")} Playing: ${(0, colors_1.blue)("MYOB is Starting...")}`);
    const activities = [
        "MYOB | &help",
        "MYOB"
    ];
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        yield ((_d = client === null || client === void 0 ? void 0 : client.user) === null || _d === void 0 ? void 0 : _d.setActivity(activities[Math.floor(Math.random() * activities.length)]));
    }), 120000);
    client.guilds.cache.forEach((guild) => {
        var _a;
        if ((_a = guild === null || guild === void 0 ? void 0 : guild.me) === null || _a === void 0 ? void 0 : _a.permissions.has("MANAGE_GUILD")) {
            guild.invites.fetch().then((invites) => {
                var _a;
                return (_a = client === null || client === void 0 ? void 0 : client.guildInvites) === null || _a === void 0 ? void 0 : _a.set(guild.id, invites);
            }).
                catch((err) => {
                Error(err);
            });
        }
    });
    client.functions.EOR = function EOR(e, message) {
        var _a;
        const embed = {
            "author": {
                "name": message.author
                    ? message.author.tag
                    : message.user.tag,
                "icon_url": message.author
                    ? message.author.avatarURL()
                    : message.user.avatarURL()
            },
            "color": "#5e5afc",
            "timestamp": new Date(),
            "footer": {
                "text": "Global Bot",
                "icon_url": (_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.avatarURL()
            },
            "fields": [],
            "title": null,
            "description": ""
        };
        if (e.error) {
            if (e.error === "yes") {
                embed.color = "0xf00020";
            }
            else if (e.error === "no") {
                embed.color = "0x008000";
            }
        }
        if (e.fields) {
            embed.fields = e.fields;
        }
        if (e.title) {
            embed.title = e.title;
        }
        if (e.desc) {
            embed.description = e.desc;
        }
        return embed;
    };
    client.functions.getLastDay = function getLastDay(year, month) {
        return new Date(year, month, 0).getDate();
    };
    client.functions.getDateFromTimestamp = function getDateFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        return `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(-2)}-${`0${date.getDate()}`.slice(-2)}`;
    };
    client.myob = new ws_1.default(`ws://localhost:${worker_threads_1.workerData.port}`);
    client.myob.onopen = () => {
        console.log("Server Open");
        client.myob.send(JSON.stringify({
            "message": "Guest",
            "system": true,
            "user": client.user,
            "from": "bot"
        }));
    };
    client.myob.onmessage = (data) => {
        const msg = JSON.parse(data.data);
        if (msg.from !== "bot") {
            client.guilds.cache.get("919356120466857984").channels.cache.get("919724869376159764").fetchWebhooks().
                then((webhooks3) => {
                const web = webhooks3.filter((e) => e.type === "Incoming").first();
                if (web) {
                    (0, node_fetch_1.default)(`https://discord.com/api/webhooks/${web.id}/${web.token}`, {
                        "method": "post",
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "body": JSON.stringify({
                            "username": `${msg.user.username}#${msg.user.discriminator}`,
                            "avatar_url": `https://cdn.discordapp.com/avatars/${msg.user.id}/${msg.user.avatar}.png`,
                            "content": msg.message
                        })
                    });
                }
                else {
                    client.guilds.cache.get("919356120466857984").channels.cache.get("919724869376159764").createWebhook(`${msg.user.username}#${msg.user.discriminator}`, {
                        "avatar": `https://cdn.discordapp.com/avatars/${msg.user.id}/${msg.user.avatar}.png`,
                        "reason": `Création de webhook par : ${msg.user.username}#${msg.user.discriminator}`
                    }).
                        then((e) => e.send(msg.message));
                }
            });
        }
    };
});
