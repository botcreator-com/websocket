import { EventEmitter } from "events";

export default class Emitter extends EventEmitter {
    static emit(arg0: string) {
        throw new Error("Method not implemented.");
    }
}