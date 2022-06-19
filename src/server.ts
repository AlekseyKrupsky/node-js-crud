import * as dotenv from 'dotenv';
import * as http from "http";
import * as domain from "node:domain";
import { IncomingMessage, ServerResponse } from "http";
import { Errors } from "./enums/errors";
import { Response } from "./response";
import { ErrorResponse } from "./ErrorResponse";
import { executeRouteHandler } from "./router";
import { cwd } from "node:process";
import { Server } from "net";

const createServer = (): Server => {
    dotenv.config({ path: `${cwd()}/.env`});

    const DEFAULT_PORT_NUMBER = 3000;

    let server;

    if (process.env.PORT !== undefined) {
        server = http.createServer().listen(process.env.PORT);
        console.log(`Server run on ${process.env.PORT} port [PID: ${process.pid}]`);
    } else {
        server = http.createServer().listen(DEFAULT_PORT_NUMBER);
        console.log(`Server run on default ${DEFAULT_PORT_NUMBER} port [PID: ${process.pid}]`);
    }

    return server;
};

export const run = (): void => {
    const server = createServer();

    server.on('request', (request: IncomingMessage, response: ServerResponse) => {
        const domainInstance = domain.create();

        domainInstance.on('error', (error) => {
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

        domainInstance.add(request);
        domainInstance.add(response);

        domainInstance.run( () => {
            console.log(`Handle request [PID: ${process.pid}]`);

            Response.setResponse(response);

            executeRouteHandler(request);
        });
    });
}
