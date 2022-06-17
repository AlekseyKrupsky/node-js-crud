import { Response } from "./response";
import { HTTPStatuses } from "./enums/statuses";

export class ErrorResponse extends Response {
    public static sendNotFoundResponse = (message: string): void => {
        Response.send(HTTPStatuses.NOT_FOUND, { message: message });
    };

    public static sendBadRequestResponse = (message: string): void => {
        Response.send(HTTPStatuses.BAD_REQUEST, { message: message });
    };

    public static sendInternalErrorResponse = (): void => {
        Response.send(HTTPStatuses.SERVER_ERROR, {message: 'Internal Error'});
    }
}