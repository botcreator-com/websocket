import {Worker} from "worker_threads";

const bot = (port: number) => {

        const worker = new Worker(
            "./dist/bot/index.js",
            {"workerData": {port}}
        );

        worker.on(
            "message",
            (data: string) => {

                console.log(data);

            }
        );

        worker.on(
            "error",
            (error: Error) => {

                console.log(error);

            }
        );
        worker.on(
            "exit",
            (code: number) => {

                if (code !== 0) {

                    console.log(new Error(`Worker stopped with exit code ${code}`));

                }

            }
        );

    },

    webSocket = (port: number) => {

        const worker = new Worker(
            "./dist/ws/index.js",
            {"workerData": {port}}
        );
        worker.on(
            "message",
            (data: string) => {

                console.log(data);

            }
        );
        worker.on(
            "error",
            (error: Error) => {

                console.log(error);

            }
        );
        worker.on(
            "exit",
            (code: number) => {

                if (code !== 0) {

                    console.log(new Error(`Worker stopped with exit code ${code}`));

                }

            }
        );

    };


webSocket(parseInt(
    process.argv[2],
    10
));
bot(parseInt(
    process.argv[2],
    10
));
