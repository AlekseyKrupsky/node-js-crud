import { ServerResponse } from "http";

const JSON_CONTENT_TYPE = {'Content-Type': 'application/json'};

export class Response {
    private static response: ServerResponse;

    public static setResponse(response: ServerResponse): void {
        Response.response = response;
    }

    public static send(status: number, payload: any|null = null): void {
        Response.response.writeHead(status, JSON_CONTENT_TYPE);

        if (payload !== null) {
            Response.response.write(JSON.stringify(payload));
        }

        Response.response.end();
    }
}
