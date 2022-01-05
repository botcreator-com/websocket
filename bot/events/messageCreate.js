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
module.exports = (client, message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.channel.id === "919724869376159764") {
        if (message.author.bot) {
            return;
        }
        yield (client === null || client === void 0 ? void 0 : client.myob.send(JSON.stringify({
            "message": message.cleanContent,
            "user": message.author,
            "from": "bot"
        })));
    }
});
