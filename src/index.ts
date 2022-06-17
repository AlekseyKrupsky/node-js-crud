import * as dotenv from 'dotenv';
import * as http from "http";
import { IncomingMessage, ServerResponse } from "http";
import { Errors } from "./enums/errors";
import { Response } from "./response";
import { ErrorResponse } from "./ErrorResponse";
import { executeRouteHandler } from "./router";

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

server.on('request', async (request: IncomingMessage, response: ServerResponse) => {
    Response.setResponse(response);

    executeRouteHandler(request).catch((error) => {
        if (error.message === Errors.ROUTE_NOT_FOUND) {
            ErrorResponse.sendNotFoundResponse('URL doesn\'t exist');

            return;
        }

        if (error.message === Errors.NOT_FOUND) {
            ErrorResponse.sendNotFoundResponse('User with provided UUID was not found');

            return;
        }

        if (error.message === Errors.INVALID_UUID) {
            ErrorResponse.sendBadRequestResponse('Invalid UUID was provided');

            return;
        }

        if (error.message === Errors.VALIDATION_FAILED) {
            ErrorResponse.sendBadRequestResponse('Validation failed. Please check fields you sent');

            return;
        }

        ErrorResponse.sendInternalErrorResponse();
    });
});
