'use strict'; // Defines that JavaScript code should be executed in 'strict mode'.
const { token } = require('./config.json'),
config = require('./config.json'),
  {Client, Collection }= require('discord.js'),
  { readdirSync } = require('fs'),
  ms = require("ms"),
    { join } = require("path"),
    {green,red, blue} = require('colors'),
    {text} = require('figlet'),
    { 
    joinVoiceChannel, 
    getVoiceConnection, 
    VoiceConnectionStatus,
    entersState,
    createAudioPlayer,
    NoSubscriberBehavior,
    createAudioResource,
    StreamType
      } = require('@discordjs/voice'),
    { createReadStream } = require('fs'),
    {loadavg, cpus, totalmem} = require("os"),
    guildInvites = new Map();
class Class extends Client {
    constructor(token) {
        super({ 
            partials:["USER","CHANNEL","GUILD_MEMBER","MESSAGE","REACTION"],
            allowedMentions : {
                    repliedUser: false
            },
            failIfNotExists: false,
            messageCacheLifetime: require("ms")("1m"),
            intents: ["GUILDS","GUILD_MEMBERS","GUILD_BANS","GUILD_EMOJIS_AND_STICKERS","GUILD_INTEGRATIONS","GUILD_INVITES","GUILD_VOICE_STATES","GUILD_PRESENCES","GUILD_MESSAGES","GUILD_MESSAGE_REACTIONS","GUILD_MESSAGE_TYPING","DIRECT_MESSAGES","DIRECT_MESSAGE_REACTIONS","DIRECT_MESSAGE_TYPING"] });
        this.config = require('./config.json');
        this.prefix = config.prefix;
        this.functions = {
                convert: function convert(number) {
    let numberSymbol = ["", "K", "M", "Md", "B"];
    let str = String(number);
    let finalNumber = str;
    let symbol = Math.floor(str.length / 3.00001);
    let num = str.length % 3;
    if (symbol > 0) {
        if (num === 0) num = 3;
        num += 2;
        finalNumber = (Number(str.substr(0, num)) / 100).toFixed(2) + numberSymbol[symbol];
    }
    return String(finalNumber).replace(".00", "");
    },
                        timetrade: function timetrade(time){
                let finaltime = 0;
                if(typeof time === "string"){
                time.split(" ").forEach(timer =>{
                    if(timer.endsWith("y")){
                        finaltime += ms(`${Number(timer.replace("y",""))}y`);
                    }
                    if(timer.endsWith("w")){
                        finaltime += ms(`${Number(timer.replace("w",""))}w`);
                    }
                    if(timer.endsWith("d")){
                        finaltime += ms(`${Number(timer.replace("d",""))}d`);
                    }
                    if(timer.endsWith("h")){
                        finaltime += ms(`${Number(timer.replace("h",""))}h`);
                    }
                    if(timer.endsWith("m")){
                        finaltime += ms(`${Number(timer.replace("m",""))}m`);
                    }
                    if(timer.endsWith("s")){
                        finaltime += ms(`${Number(timer.replace("s",""))}s`);
                    }
                })
            return finaltime;
            }else{
            return require("./functions/parsems")(time)
            }             
        }
        };
        this.langs = {
            fr: require("./lang/fr.json")
        }
        this.guildInvites = guildInvites;
        this.colors = {
            red: 16711680,
            green: 32560,
            default: 3092790 //Discord Color
        }
        this.voc = { 
    joinVoiceChannel, 
    getVoiceConnection, 
    VoiceConnectionStatus,
    entersState,
    createAudioPlayer,
    NoSubscriberBehavior,
    createAudioResource,
    StreamType,
    createReadStream
      }
        this.timeoutsVoc = {
                guild : new Set(),
                cmd : new Set()
            };
        this.guildVoc = new Map()
        this.footer = "MYOB"    
        /**
         * @param {String} reload_event - Event file name without .js
         * @return {Promise<String>}
         */
        this.reloadEvent = function(reload_event) {
            return new Promise((resolve) => {
                const files = readdirSync(join(__dirname, "events"));
                files.forEach((e) => {
                    try {
                        const fileName = e.split('.')[0];
                        if(fileName === reload_event) {
                            const file = require(join(__dirname, "events", e));
                            const res = this.listeners(fileName)
                            this.off(fileName, res[0]);
                            this.on(fileName, file.bind(null, this));
                            delete require.cache[require.resolve(join(__dirname, "events", e))];
                            resolve(`> Reloaded \`${reload_event}\``)
                        }
                    } catch (error) {
                        throw new Error(`${red('[Events]')} Failed to load event ${e}: ${error.stack || error}`)
                    }
                });
                resolve(`> Event named: \`${reload_event}\` not found`)
            })
        }
      
        this.reloadAllEvents = function() {
            return new Promise((resolve) => {
                let count = 0;
                const files = readdirSync(join(__dirname, "events"));
                files.forEach((e) => {
                    try {
                        count++;
                        const fileName = e.split('.')[0];
                        this.reloadEvent(fileName);
                    } catch (error) {
                        throw new Error(`${red('[Events Reload]')} Failed to load event ${e}: ${error.stack || error}`)
                    }
                });
                console.log(`${green('[Events Reload]')} Loaded ${count}/${files.length} events`);
                resolve(`> Reloaded \`${count}\`/\`${files.length}\` events`)
            })
        }
        try {
            this.launch().then(() => { console.log(blue('All is launched, Connecting to Discord..')); })
        } catch (e) {
            throw new Error(e)
        }
        this.login(token);
    }

    async launch() {
        console.log(blue("G-Bot Start"));
        this._eventsHandler();
        this._processEvent();
        this._startingMessage();

    }

    _eventsHandler() {
        let count = 0;
        const files = readdirSync(join(__dirname, "events"));
        files.forEach((e) => {
            try {
                count++;
                const fileName = e.split('.')[0];
                const file = require(join(__dirname, "events", e));
                this.on(fileName, file.bind(null, this));
                delete require.cache[require.resolve(join(__dirname, "events", e))];
            } catch (error) {
                throw new Error(`${red('[Events]')} Failed to load event ${e}: ${error.stack || error}`)
            }
        });
        console.log(`${green('[Events]')} Loaded ${count}/${files.length} events`)
    }

    _startingMessage() {
        const cpuCores = cpus().length;
        //Custom Starting Message
        text('Obvision', {
            font: "Standard"
        }, function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            const data2 = data;
            text('A General Bot for Discord', {
            }, function(err, data) {
                if (err) {
                    console.log('Something went wrong...');
                    console.dir(err);
                    return;
                }
                console.log("================================================================================================================================"+"\n"+
                                data2+"\n\n"+ data +"\n"+
                            "================================================================================================================================"+ "\n"+
                                `CPU: ${(loadavg()[0]/cpuCores).toFixed(2)}% / 100%` + "\n" +
                                `RAM: ${Math.trunc((process.memoryUsage().heapUsed) / 1000 / 1000)} MB / ${Math.trunc(totalmem() / 1000 / 1000)} MB` + "\n" +
                                //`Discord WebSocket Ping: ${this.ws.ping}` + "\n" +
                            "================================================================================================================================"
                );
            });

        });
    }

   _processEvent() {
        process.on('unhandledRejection', error => {
            if(error.code === 50007) return
            console.error(green('✅ An Error has occured : ') + red(error.stack));
            let details = `\`\`\`\nName : ${error.name}\nMessage : ${error.message}`
            if (error.path) details += `\nPath : ${error.path}`
            if (error.code) details += `\nError Code : ${error.code}`
            if (error.method) details += `\nMethod : ${error.method}`
            if (this.users) this.users.cache.get(this.config.owner.id).send({
                embeds: [{
                    description: `🔺 **An Error has occured:**\n\`\`\`js\n${error}\`\`\``,
                    color: this.maincolor,
                    fields: [
                        {
                            name: "🔺 Details :",
                            value: `${details}\`\`\``
                        }
                    ]
                }]
            })
        });
    }
}

module.exports = new Class(token);

