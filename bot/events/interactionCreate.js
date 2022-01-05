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
module.exports = (client, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.isMessageComponent()) {
        if (data.isSelectMenu()) {
            yield client.emit("menus", data);
        }
        else if (data.isButton()) {
            yield client.emit("button", data);
        }
    }
    else if (data.isCommand()) {
        yield client.emit("slashCommands", data);
    }
});
