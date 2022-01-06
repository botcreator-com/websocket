import config from "./config.json";
import ExtendedClient from "./extendedClient";

export default new ExtendedClient(config.token);
