import { Request, Response } from "express";
import InteractionsService from "../services/Interactions/Interactions.service";
import Logs from "../utils/logs";
import ReplyError from "../utils/response/replyError";

export default class InteractionsController {

    private _interactionsService = new InteractionsService();

    public async createInteraction(request: Request, response: Response): Promise<void> {

        const appId = request.params.appId;
        // const ip = (request.headers["x-forwarded-for"] as string) || request.connection.remoteAddress;
        const ip = request.ip;

        try {

            this._interactionsService.addInteractionCallbackPing(appId, ip);

            response.status(200).json({
                type: "ping"
            });

        } catch (error: any) {

            Logs.error(error);
            ReplyError.replyServerError(response);

        }
    }

    public async pingInteraction(request: Request, response: Response): Promise<void> {

        const appId = request.params.appId;
        // const ip = (request.headers["x-forwarded-for"] as string) || request.connection.remoteAddress;
        const ip = request.ip;

        try {

            const isAdd = this._interactionsService.addInteractionCallback(appId, ip);

            if (isAdd) {
                response.status(201).send();
            } else {
                response.status(400).send();
            }

        } catch (error: any) {

            Logs.error(error);
            ReplyError.replyServerError(response);

        }
    }
}
