import { IncomingMessage } from "http";
import { HTTPStatuses } from "../enums/statuses";
import { User } from "../user";
import { Response } from "../response";
import { validateUser } from "../validation/userValidation";

class UserController {
    getUsers = () => {
        User.getUsers();

        Response.send(HTTPStatuses.SUCCESS, User.getUsers());
    };

    createUser = async (request: IncomingMessage) => {
        let requestBody: string = '';

        request.on('data', (chunk: any) => {
            requestBody += chunk.toString();
        });

        return new Promise((resolve, reject) => {
            request.on('end', () => {
                try {
                    const parsedBody = JSON.parse(requestBody);

                    validateUser(parsedBody);

                    const createdUser = User.create(parsedBody.name, parsedBody.age, parsedBody.hobbies);

                    Response.send(HTTPStatuses.CREATED, createdUser);

                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            });
        });
    };

    getUser = (uuid: string) => {
        const user = User.getUserByUUID(uuid);

        Response.send(HTTPStatuses.SUCCESS, user);
    };

    updateUser = (request: IncomingMessage, uuid: string) => {
        let requestBody: string = '';

        request.on('data', (chunk: any) => {
            requestBody += chunk.toString();
        });

        return new Promise((resolve, reject) => {
            request.on('end', () => {
                try {
                    const parsedBody = JSON.parse(requestBody);

                    validateUser(parsedBody);

                    const updatedUser = User.updateUser(uuid, parsedBody.name, parsedBody.age, parsedBody.hobbies);

                    Response.send(HTTPStatuses.SUCCESS, updatedUser);

                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            });
        });
    };

    removeUser = (uuid: string) => {
        User.removeByUUID(uuid);

        Response.send(HTTPStatuses.NO_CONTENT);
    };
}

export default (() => new UserController())();