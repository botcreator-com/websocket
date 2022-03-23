import ExtendedClient from "./extendedClient";
import {workerData} from "worker_threads";
const data = JSON.parse(workerData);
export default new ExtendedClient(data.token);
