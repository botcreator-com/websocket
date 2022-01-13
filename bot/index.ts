import ExtendedClient from "./extendedClient";
import {workerData} from "worker_threads";

export default new ExtendedClient(workerData.token);
