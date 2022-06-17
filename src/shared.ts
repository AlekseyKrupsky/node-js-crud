import { User } from "./user";
import { Worker } from "cluster";
import { MessageStatuses } from "./enums/statuses";

type Payload = {
    action: string,
    payload: any[]
}

const sendToMaster = (action: string, ...args: any[]): Promise<any> => {
    (<any> process).send({ action: action, payload: args });

    return new Promise((resolve, reject) => {
        process.once('message', (response: any) => {
            response.status === MessageStatuses.SUCCESS ? resolve(response.data) : reject(new Error(response.data));
        });
    })
};

const sendToWorker = (worker: Worker, data: Payload): void => {
    const payload = data['payload'];
    const methodName: string = data['action'];

    try {
        // @ts-ignore
        const result = User[methodName](...payload);

        worker.send({ status: MessageStatuses.SUCCESS, data: result });
    } catch (error) {
        if (error instanceof Error) {
            worker.send({ status: MessageStatuses.ERROR, data: error.message });
        }
    }
};

export { Payload, sendToMaster, sendToWorker };