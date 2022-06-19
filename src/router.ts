import { IncomingMessage } from "http";
import UserController from "./controllers/userController";
import { Errors } from "./enums/errors";

export const executeRouteHandler = (request: IncomingMessage): void => {
    const url = request.url;

    if (url === undefined) {
        throw new Error('Request url is undefined');
    }

    if (url === '/api/users') {
        if (request.method === 'GET') {
            UserController.getUsers();

            return;
        }

        if (request.method === 'POST') {
            UserController.createUser(request);

            return;
        }
    }

    if (url.search(/\/api\/users\/[a-z\d-]/) !== -1) {
        const uuid = url.replace('/api/users/', '');

        if (request.method === 'GET') {
            UserController.getUser(uuid);

            return;
        }

        if (request.method === 'PUT') {
            UserController.updateUser(request, uuid);

            return;
        }

        if (request.method === 'DELETE') {
            UserController.removeUser(uuid);

            return;
        }
    }

    throw new Error(Errors.ROUTE_NOT_FOUND);
};
