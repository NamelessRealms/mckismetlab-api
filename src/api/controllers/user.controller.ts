import { Request, Response } from "express";

import UserService from "../services/user/user.service";
import IUserLink from "../../interface/user/IUserLink";
import VerifyRequestParameter from "../utils/verify/verifyRequestParameter";
import ReplyError from "../utils/response/replyError";
import Logs from "../utils/logs";

export default class UserController {

    private _userService = new UserService();

    public async getAllUserLink(request: Request, response: Response): Promise<void> {
        try {

            const userLinkData = await this._userService.getAllUserLink();

            if (userLinkData.length !== 0) {
                response.status(200).json(userLinkData);
            } else {
                response.status(204).send();
            }

        } catch (error: any) {
            Logs.error(error);
            ReplyError.replyServerError(response);
        }
    }

    public async createUserLink(request: Request, response: Response): Promise<void> {

        const bodyData: IUserLink | IUserLink[] = request.body;

        // 確保客戶端必要的參數
        if (!VerifyRequestParameter.verify(bodyData, ["minecraft_uuid", "discord_id"])) {
            return ReplyError.replyParameterError(response);
        }

        try {

            const createUserLink = await this._userService.createUserLink(bodyData);

            if (createUserLink.modified) {
                response.status(201).json({
                    message: "success",
                    info: bodyData
                });
            } else {
                response.status(304).send();
            }

        } catch (error: any) {
            Logs.error(error);
            ReplyError.replyServerError(response);
        }
    }

    public async getUserLink(request: Request, response: Response): Promise<void> {

        // minecraft player uuid or discord user id
        const id = request.params.id;

        const userLinkData = await this._userService.getUserLink(id);

        if (userLinkData !== undefined) {
            response.status(200).json(userLinkData);
        } else {
            response.status(204).send();
        }
    }

    public async getPlayerRole(request: Request, response: Response): Promise<void> {

        const minecraftUUID = request.params.minecraftUUID;

        const playerRoleData = await this._userService.getPlayerRole(minecraftUUID);

        if (playerRoleData !== undefined) {
            response.status(200).json(playerRoleData);
        } else {
            response.status(204).send();
        }
    }
}
