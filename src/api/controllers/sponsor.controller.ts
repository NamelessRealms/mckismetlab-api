import { Request, Response } from "express";

import ISponsorUser from "../../interface/sponsor/ISponsorUser";
import SponsorService from "../services/sponsor/sponsor.service";
import Logs from "../utils/logs";
import ReplyError from "../utils/response/replyError";
import VerifyRequestParameter from "../utils/verify/verifyRequestParameter";

export default class SponsorController {

    private _sponsorService = new SponsorService();

    public async getAllSponsorUser(request: Request, response: Response): Promise<void> {

        const sponsorUserListData = await this._sponsorService.getAllSponsorUser();

        if (sponsorUserListData.length !== 0) {
            response.status(200).json(sponsorUserListData);
        } else {
            response.status(204).json([]);
        }
    }

    public async createSponsorUser(request: Request, response: Response): Promise<void> {

        const bodyData: ISponsorUser | ISponsorUser[] = request.body;

        // 確保客戶端必要的參數
        if (!VerifyRequestParameter.verify(bodyData, ["minecraft_uuid", "money"])) {
            return ReplyError.replyParameterError(response);
        }

        try {

            const createSponsorUser = await this._sponsorService.createSponsorUser(bodyData);

            if (createSponsorUser.modified) {
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

    public async patchSponsorUser(request: Request, response: Response): Promise<void> {

        const uuid = request.params.uuid;
        const bodyData: { money: number } = request.body;

        // 確保客戶端必要的參數
        if (!VerifyRequestParameter.verify(bodyData, ["money"], false)) {
            return ReplyError.replyParameterError(response);
        }

        try {

            const patchSponsorUser = await this._sponsorService.patchSponsorUser(uuid, bodyData.money);

            if (patchSponsorUser.modified) {
                response.status(201).json({
                    message: "success",
                    info: patchSponsorUser.info
                });
            } else {
                response.status(304).send();
            }

        } catch (error: any) {

            if (error.error === "not_replace_data") {

                response.status(400).json({
                    error: error.error,
                    error_description: error.error_description
                });

            } else {

                Logs.error(error);
                ReplyError.replyServerError(response);

            }
        }
    }

    public async deleteSponsorUser(request: Request, response: Response): Promise<void> {

        const uuid = request.params.uuid;
        await this._sponsorService.deleteSponsorUser(uuid);

        response.status(204).send();
    }

    public async getSponsorUser(request: Request, response: Response): Promise<void> {

        const uuid = request.params.uuid;
        const sponsorUserData = await this._sponsorService.getSponsorUser(uuid);

        if (sponsorUserData !== undefined) {
            response.status(200).json(sponsorUserData);
        } else {
            response.status(204).send();
        }
    }
}
