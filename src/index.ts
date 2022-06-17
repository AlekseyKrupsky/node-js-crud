import cluster from 'node:cluster';
import { run } from './server';
import { cpus } from 'node:os';
import { sendToWorker, Payload } from "./shared";
import { Worker } from "cluster";

if (process.argv.indexOf('--multi') !== -1 && cluster.isPrimary) {
    const numCPUs = cpus().length;

    console.log(`Server with ${numCPUs} workers stared...`);

    for (let i = 0; i < numCPUs; i++) {
        console.log(`Starting worker number ${i + 1}`);
        cluster.fork();
    }

    cluster.on('message', (worker: Worker, data: Payload) => {
        sendToWorker(worker, data);
    });

    cluster.on('disconnect', () => {
        console.log('Restart disconnected worker...');
        cluster.fork();
    });
} else {
    run();
}
