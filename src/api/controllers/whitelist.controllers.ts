import { Request, Response } from "express";

import IAwaitVerify from "../../interface/whitelist/IAwaitVerify";
import IManualVerify from "../../interface/whitelist/IManualVerify";
import IServerWhilelist from "../../interface/whitelist/IServerWhilelist";
import TpmeVerifyWhitelist from "../../interface/whitelist/ITpmeVerifyWhitelist";
import WhitelistService from "../services/whitelist/whitelist.service";
import Logs from "../utils/logs";
import ReplyError from "../utils/response/replyError";
import VerifyRequest from "../utils/verify/verifyRequest";
import VerifyRequestParameter from "../utils/verify/verifyRequestParameter";

export default class WhitelistController {

    private readonly _whitelistService = new WhitelistService();

    public async createAwaitVerify(request: Request, response: Response): Promise<void> {

        const bodyData: IAwaitVerify | IAwaitVerify[] = request.body;

        // 確保客戶端必要的參數
        if (!this._verifyAwaitVerifyRequest(bodyData)) {
            return ReplyError.replyParameterError(response);
        }

        try {

            const createAwaitVerify = await this._whitelistService.createAwaitVerify(bodyData);

            if (createAwaitVerify.modified) {
                response.status(201).json({
                    message: "success",
                    info: bodyData
                });
            } else {
                response.status(304).send();
            }

        } catch (error: any) {
            Logs.error(error);
            return ReplyError.replyServerError(response);
        }
    }

    private _verifyAwaitVerifyRequest(requestBody: IAwaitVerify | IAwaitVerify[]): boolean {

        const verifyParameterMethod = (body: IAwaitVerify): boolean => {
            if (!body.hasOwnProperty("timestamp")) {
                return false;
            }

            if (!body.hasOwnProperty("server_id")) {
                return false;
            }

            if (!body.hasOwnProperty("minecraft_id")) {
                return false;
            }

            if (!body.hasOwnProperty("discord_id")) {
                return false;
            }

            if (!body.hasOwnProperty("consent_rules")) {
                return false;
            }

            return true;
        }

        return VerifyRequest.verifyParameter(requestBody, verifyParameterMethod);
    }

    public async getAwaitVerify(request: Request, response: Response): Promise<void> {

        const discordId = request.params.discordId;
        const awaitVerifyData = await this._whitelistService.getAwaitVerify(discordId);

        if (awaitVerifyData !== undefined) {
            response.status(200).json(awaitVerifyData);
        } else {
            response.status(204).send();
        }
    }

    public async deleteAwaitVerify(request: Request, response: Response): Promise<void> {

        const discordId = request.params.discordId;
        await this._whitelistService.deleteAwaitVerify(discordId);

        response.status(204).send();
    }

    public async getAllManualVerify(request: Request, response: Response): Promise<void> {

        const allManualVerifyData = await this._whitelistService.getAllManualVerify();

        if (allManualVerifyData.length !== 0) {
            response.status(200).json(allManualVerifyData);
        } else {
            response.status(204).send();
        }
    }

    public async createManualVerify(request: Request, response: Response): Promise<void> {

        const bodyData: IManualVerify | IManualVerify[] = request.body;

        // 確保客戶端必要的參數
        if (!this._verifyManualVerifyRequest(bodyData)) {
            return ReplyError.replyParameterError(response);
        }

        try {

            const createManualVerify = await this._whitelistService.createManualVerify(bodyData);

            if (createManualVerify.modified) {
                response.status(201).json({
                    message: "success",
                    info: bodyData
                });
            } else {
                response.status(304).send();
            }

        } catch (error: any) {
            Logs.error(error);
            return ReplyError.replyServerError(response);
        }
    }

    private _verifyManualVerifyRequest(requestBody: IManualVerify | IManualVerify[]): boolean {

        const verifyParameterMethod = (body: IManualVerify): boolean => {
            if (!body.hasOwnProperty("minecraft_uuid")) {
                return false;
            }

            if (!body.hasOwnProperty("minecraft_id")) {
                return false;
            }

            if (!body.hasOwnProperty("discord_user_name")) {
                return false;
            }

            if (!body.hasOwnProperty("discord_user_id")) {
                return false;
            }

            if (!body.hasOwnProperty("channel_id")) {
                return false;
            }

            if (!body.hasOwnProperty("message_id")) {
                return false;
            }

            if (!body.hasOwnProperty("server_id")) {
                return false;
            }

            return true;
        }

        return VerifyRequest.verifyParameter(requestBody, verifyParameterMethod);
    }

    public async getManualVerify(request: Request, response: Response): Promise<void> {

        const discordUserId = request.params.discordUserId;
        const manualVerifyData = await this._whitelistService.getManualVerify(discordUserId);

        if (manualVerifyData !== undefined) {
            response.status(200).json(manualVerifyData);
        } else {
            response.status(204).send();
        }
    }

    public async getManualVerifyCIdMId(request: Request, response: Response): Promise<void> {

        const channelId = request.params.channelId;
        const messageId = request.params.messageId;

        const manualVerifyData = await this._whitelistService.getManualVerifyCIdMId(channelId, messageId);

        if (manualVerifyData !== undefined) {
            response.status(200).json(manualVerifyData);
        } else {
            response.status(204).send();
        }
    }

    public async deleteManualVerify(request: Request, response: Response): Promise<void> {

        const channelId = request.params.channelId;
        const messageId = request.params.messageId;

        await this._whitelistService.deleteManualVerify(channelId, messageId);

        response.status(204).send();
    }

    public async getAllServerWhitelist(request: Request, response: Response): Promise<void> {

        const allServerWhitelistData = await this._whitelistService.getAllServerWhitelist();

        if (allServerWhitelistData.length !== 0) {
            response.status(200).json(allServerWhitelistData);
        } else {
            response.status(204).send();
        }
    }

    public async createServerWhitelist(request: Request, response: Response): Promise<void> {

        const bodyData: IServerWhilelist = request.body;

        // 確保客戶端必要的參數
        if (!this._verifyServerWhitelistRequest(bodyData)) {
            return ReplyError.replyParameterError(response);
        }

        try {

            const createServerWhitelist = await this._whitelistService.createServerWhitelist(bodyData);

            if (createServerWhitelist.modified) {
                response.status(201).json({
                    message: "success",
                    info: bodyData
                });
            } else {
                response.status(304).send();
            }

        } catch (error: any) {
            Logs.error(error);
            return ReplyError.replyServerError(response);
        }
    }

    private _verifyServerWhitelistRequest(requestBody: IServerWhilelist): boolean {

        const verifyParameterMethod = (body: IManualVerify): boolean => {

            if (!body.hasOwnProperty("minecraft_uuid")) {
                return false;
            }

            if (!body.hasOwnProperty("server_id")) {
                return false;
            }

            return true;
        }

        return VerifyRequest.verifyParameter(requestBody, verifyParameterMethod);
    }

    public async getServerWhitelist(request: Request, response: Response): Promise<void> {

        const minecraftUUID = request.params.minecraftUUID;
        const serverWhitelistData = await this._whitelistService.getServerWhitelist(minecraftUUID);

        if (serverWhitelistData === undefined) {
            response.status(204).end();
            return;
        }

        if(serverWhitelistData.length <= 0) {
            response.status(204).end();
            return;
        }

        response.status(200).json(serverWhitelistData);
    }

    public async getServerWhitelistServerId(request: Request, response: Response): Promise<void> {

        const minecraftUUID = request.params.minecraftUUID;
        const serverId = request.params.serverId;

        const serverWhitelistData = await this._whitelistService.getServerWhitelistServerId(minecraftUUID, serverId);

        if (serverWhitelistData !== undefined) {
            response.status(200).json(serverWhitelistData);
        } else {
            response.status(204).send();
        }
    }

    public async deleteServerWhitelist(request: Request, response: Response): Promise<void> {

        const minecraftUUID = request.params.minecraftUUID;
        await this._whitelistService.deleteServerWhitelist(minecraftUUID);

        response.status(204).send();
    }

    public async createTpmeVerifyWhitelist(request: Request, response: Response): Promise<void> {

        const bodyData: TpmeVerifyWhitelist | TpmeVerifyWhitelist[] = request.body;

        // 確保客戶端必要的參數
        if (!VerifyRequestParameter.verify(bodyData, ["minecraft_name", "minecraft_uuid", "discord_user_name", "discord_user_id", "server_Id"])) {
            return ReplyError.replyParameterError(response);
        }

        try {

            const createTpmeVerifyWhitelist = await this._whitelistService.createTpmeVerifyWhitelist(bodyData);

            if (createTpmeVerifyWhitelist.modified) {
                response.status(201).json({
                    message: "success",
                    info: bodyData
                });
            } else {
                response.status(304).send();
            }

        } catch (error: any) {
            Logs.error(error);
            return ReplyError.replyServerError(response);
        }

    }

    public async getAllTpmeVerifyWhitelist(request: Request, response: Response): Promise<void> {

        const allTpmeVerifyWhitelist = await this._whitelistService.getAllTpmeVerifyWhitelist();

        if (allTpmeVerifyWhitelist.length !== 0) {
            response.status(200).json(allTpmeVerifyWhitelist);
        } else {
            response.status(204).send();
        }
    }

    public async deleteTpmeVerifyWhitelist(request: Request, response: Response): Promise<void> {

        const discordUserId = request.params.discordUserId;

        await this._whitelistService.deleteTpmeVerifyWhitelist(discordUserId);

        response.status(204).send();
    }
}
