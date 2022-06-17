import { IncomingMessage } from "http";
import { HTTPStatuses } from "../enums/statuses";
import { User } from "../user";
import { Response } from "../response";
import { validateUser } from "../validation/userValidation";
import cluster from "node:cluster";
import { sendToMaster } from "../shared";

class UserController {
    getUsers = (): void => {
        if (cluster.isPrimary) {
            Response.send(HTTPStatuses.SUCCESS, User.getUsers());
        } else {
            const createdUserPromise = sendToMaster('getUsers', []);

            createdUserPromise.then((result) => {
                Response.send(HTTPStatuses.SUCCESS, result);
            });
        }
    };

    createUser = (request: IncomingMessage): void => {
        let requestBody: string = '';

        request.on('data', (chunk: any) => {
            requestBody += chunk.toString();
        });

        request.on('end', () => {
            const parsedBody = JSON.parse(requestBody);

            validateUser(parsedBody);

            if (cluster.isPrimary) {
                const createdUser = User.create(parsedBody.name, parsedBody.age, parsedBody.hobbies);

                Response.send(HTTPStatuses.CREATED, createdUser);
            } else {
                const createdUserPromise = sendToMaster('create', parsedBody.name, parsedBody.age, parsedBody.hobbies);

                createdUserPromise.then((result) => {
                    Response.send(HTTPStatuses.CREATED, result);
                });
            }
        });
    };

    getUser = (uuid: string): void => {
        if (cluster.isPrimary) {
            Response.send(HTTPStatuses.SUCCESS, User.getUserByUUID(uuid));
        } else {
            const createdUserPromise = sendToMaster('getUserByUUID', uuid);

            createdUserPromise.then((result) => {
                Response.send(HTTPStatuses.SUCCESS, result);
            });
        }
    };

    updateUser = (request: IncomingMessage, uuid: string): void => {
        let requestBody: string = '';

        request.on('data', (chunk: any) => {
            requestBody += chunk.toString();
        });

        request.on('end', () => {
            const parsedBody = JSON.parse(requestBody);

            validateUser(parsedBody);

            if (cluster.isPrimary) {
                const updatedUser = User.updateUser(uuid, parsedBody.name, parsedBody.age, parsedBody.hobbies);

                Response.send(HTTPStatuses.SUCCESS, updatedUser);
            } else {
                const createdUserPromise = sendToMaster('updateUser', uuid, parsedBody.name, parsedBody.age, parsedBody.hobbies);

                createdUserPromise.then((result) => {
                    Response.send(HTTPStatuses.SUCCESS, result);
                });
            }
        });
    };

    removeUser = (uuid: string): void => {
        if (cluster.isPrimary) {
            User.removeByUUID(uuid);

            Response.send(HTTPStatuses.NO_CONTENT);
        } else {
            const createdUserPromise = sendToMaster('removeByUUID', uuid);

            createdUserPromise.then(() => {
                Response.send(HTTPStatuses.NO_CONTENT);
            });
        }
    };
}

export default (() => new UserController())();