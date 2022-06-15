import * as dotenv from 'dotenv';
import * as http from "http";
import { HTTPStatuses } from "./enums/statuses";
import { IncomingMessage, ServerResponse } from "http";
import { IUser } from "./user2";
import { User } from "./user";
import { Errors } from "./enums/errors";

dotenv.config();

const DEFAULT_PORT_NUMBER = 3000;

let server;

if (process.env.PORT !== undefined) {
    server = http.createServer().listen(process.env.PORT);
    console.log(`Server run on ${process.env.PORT} port`);
} else {
    server = http.createServer().listen(DEFAULT_PORT_NUMBER);
    console.log(`Server run on default ${DEFAULT_PORT_NUMBER} port`);
}

const JSON_CONTENT_TYPE = {'Content-Type': 'application/json'};

server.on('request', async (request, response) => {
    try {
        const url = request.url as string;

        if (url === '/api/users') {
            if (request.method === 'GET') {
                getUsers(response);

                return;
            }

            if (request.method === 'POST') {
                await createUser(request, response);

                return;
            }
        }

        if (url.search(/\/api\/users\/[a-z\d-]/) !== -1) {
            const uuid = url.replace('/api/users/', '');

            if (request.method === 'GET') {
                getUser(uuid, response);

                return;
            }

            if (request.method === 'PUT') {
                await updateUser(request, response, uuid);

                return;
            }

            if (request.method === 'DELETE') {
                removeUser(uuid, response);

                return;
            }
        }

        sendNotFoundResponse(response, 'URL doesn\'t exist');
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === Errors.NOT_FOUND) {
                sendNotFoundResponse(response, 'User with provided UUID was not found');

                return;
            }

            if (error.message === Errors.INVALID_UUID) {
                sendBadRequestResponse(response, 'Invalid UUID was provided');

                return;
            }

            if (error.message === Errors.VALIDATION_FAILED) {
                sendBadRequestResponse(response, 'Validation failed. Please check fields you sent');

                return;
            }

            sendInternalErrorResponse(response);
        }
    }
});

const getUsers = (response: ServerResponse) => {
    response.writeHead(HTTPStatuses.SUCCESS, JSON_CONTENT_TYPE);
    User.getUsers();

    response.write(JSON.stringify(User.getUsers()));
    response.end();
};

const createUser = async (request: IncomingMessage, response: ServerResponse) => {
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

                response.writeHead(HTTPStatuses.CREATED, JSON_CONTENT_TYPE);
                response.write(JSON.stringify(createdUser));
                response.end();

                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    });
};

const getUser = (uuid: string, response: ServerResponse) => {
    const user = User.getUserByUUID(uuid);

    response.writeHead(HTTPStatuses.SUCCESS, JSON_CONTENT_TYPE);
    response.write(JSON.stringify(user));
    response.end();
};

const updateUser = (request: IncomingMessage, response: ServerResponse, uuid: string) => {
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

                response.writeHead(HTTPStatuses.SUCCESS, JSON_CONTENT_TYPE);
                response.write(JSON.stringify(updatedUser));
                response.end();

                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    });
};

const removeUser = (uuid: string, response: ServerResponse) => {
    User.removeByUUID(uuid);

    response.writeHead(HTTPStatuses.NO_CONTENT, JSON_CONTENT_TYPE);
    response.end();
};

const validateUser = (request: IUser): void => {
    if (
        request.name !== undefined && typeof request.name === "string"
        && request.age !== undefined && typeof request.age === "number"
        && request.hobbies !== undefined && Array.isArray(request.hobbies)
        && isArrayOfStrings(request.hobbies)
    ) {
        return;
    }

    throw new Error(Errors.VALIDATION_FAILED);
};

const isArrayOfStrings = (array: any) => {
    return array.every((elem: any) => (typeof elem === "string"));
};

const sendNotFoundResponse = (response: ServerResponse, message: string) => {
    sendMessageResponse(message, HTTPStatuses.NOT_FOUND, response);
};

const sendBadRequestResponse = (response: ServerResponse, message: string) => {
    sendMessageResponse(message, HTTPStatuses.BAD_REQUEST, response);
};

const sendInternalErrorResponse = (response: ServerResponse) => {
    sendMessageResponse('Internal Error', HTTPStatuses.SERVER_ERROR, response);
}

const sendMessageResponse = (message: string, code: number, response: ServerResponse) => {
    response.writeHead(code, JSON_CONTENT_TYPE);

    response.write(JSON.stringify({message: message}));
    response.end();
};

