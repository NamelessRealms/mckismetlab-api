import { Request, Response } from "express";
import ModsService from "../services/mods/mods.service";
import Logs from "../utils/logs";
import ReplyError from "../utils/response/replyError";
import VerifyRequestParameter from "../utils/verify/verifyRequestParameter";

export default class ModsController {

    private _modsService = new ModsService();

    public async getMod(request: Request, response: Response): Promise<void> {

        const projectId = request.params.projectId;
        const fileId = request.params.fileId;

        try {

            const mod = await this._modsService.getMod(projectId, fileId);

            response.status(200).json(mod);

        } catch (error: any) {

            if (error.error === "request_curseforge_error") {
                response.status(400).send(error);
                return;
            }

            Logs.error(error);
            ReplyError.replyServerError(response);
        
        }
    }

    public async getMods(request: Request, response: Response): Promise<void> {

        const bodyData: { modIds: Array<string> } = request.body;

        // 確保客戶端必要的參數
        if (!VerifyRequestParameter.verify(bodyData, ["modIds"])) {
            return ReplyError.replyParameterError(response);
        }

        try {

            const modIds = bodyData.modIds;
            const modsData = await this._modsService.getMods(modIds);

            response.status(200).json(modsData);

        } catch (error: any) {
            
            if (error.error === "request_curseforge_error") {
                response.status(400).send(error);
                return;
            }

            Logs.error(error);
            ReplyError.replyServerError(response);

        }
    }

    public async getModFiles(request: Request, response: Response): Promise<void> {

        const bodyData: { fileIds: Array<string> } = request.body;

        // 確保客戶端必要的參數
        if (!VerifyRequestParameter.verify(bodyData, ["fileIds"])) {
            return ReplyError.replyParameterError(response);
        }

        try {

            const fileIds = bodyData.fileIds;
            const modFilesData = await this._modsService.getModFiles(fileIds);

            response.status(200).json(modFilesData);

        } catch (error: any) {
            
            if (error.error === "request_curseforge_error") {
                response.status(400).send(error);
                return;
            }

            Logs.error(error);
            ReplyError.replyServerError(response);

        }
    }
}