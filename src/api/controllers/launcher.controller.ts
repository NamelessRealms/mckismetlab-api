import { Request, Response } from "express";

import LauncherService from "../services/launcher/launcher.service";
import Logs from "../utils/logs";
import ReplyError from "../utils/response/replyError";
import VerifyRequestParameter from "../utils/verify/verifyRequestParameter";

export default class LauncherController {

    private _launcherService = new LauncherService();

    public async getLauncherAssets(request: Request, response: Response): Promise<void> {

        const launcherAssetsData = await this._launcherService.getLauncherAssets();

        response.status(200).json(launcherAssetsData);
    }

    public async getLauncherPage(request: Request, response: Response): Promise<void> {

        const launcherPageData = await this._launcherService.getLauncherPage();

        response.status(200).json(launcherPageData);
    }

    public async putLauncherAssets(request: Request, response: Response): Promise<void> {
        try {

            const launcherAssetsBody = request.body;
            const putLauncherAssets = await this._launcherService.putLauncherAssets(JSON.stringify(launcherAssetsBody));

            if (putLauncherAssets.modified) {
                response.status(201).json({
                    message: "success",
                    info: launcherAssetsBody
                });
            } else {
                response.status(304).send();
            }

        } catch (error: any) {
            Logs.error(error);
            ReplyError.replyServerError(response);
        }
    }

    public async putLauncherPage(request: Request, response: Response): Promise<void> {
        try {

            const launcherPageBody = request.body;
            const putLauncherPage = await this._launcherService.putLauncherPage(JSON.stringify(launcherPageBody));

            if (putLauncherPage.modified) {
                response.status(201).json({
                    message: "success",
                    info: launcherPageBody
                });
            } else {
                response.status(304).send();
            }

        } catch (error: any) {
            Logs.error(error);
            ReplyError.replyServerError(response);
        }
    }

    // public async createIssuelogFile(request: Request, response: Response): Promise<void> {
    //     try {

    //         const bodyData = request.body;

    //         // 確保客戶端必要的參數
    //         if (!VerifyRequestParameter.verify(bodyData, ["type", "fileName", "issueId", "content"], false)) {
    //             return ReplyError.replyParameterError(response);
    //         }

    //         const createIssuelogFile = await this._launcherService.createIssuelogFile(bodyData);

    //         if (createIssuelogFile.modified) {
    //             response.status(201).json({
    //                 message: "success",
    //                 info: bodyData
    //             });
    //         } else {
    //             response.status(304).send();
    //         }

    //     } catch (error: any) {
    //         Logs.error(error);
    //         ReplyError.replyServerError(response);
    //     }
    // }

    public async getAutoUpdaterLatest(request: Request, response: Response): Promise<void> {
        try {

            const clientVersion = request.query.version;
            const githubReleasesLatest = await this._launcherService.getGithubReleasesLatest();
            const releasesLatestVersion = (githubReleasesLatest.tag_name as string).replace("v", "");

            if(clientVersion === releasesLatestVersion) {
                response.status(204).end();
            } else {
                response.json({
                    url: "https://github.com/QuasiMkl/mckismetlab-launcher/releases/download/v0.3.0-beta/mckismetlab-launcher-Setup-0.3.0-beta.exe"
                });
            }

            response.status(200).end();

        } catch(error: any) {

            if(error.error === "get-api-statusCode-not-200" || error.error === "github-api-offline") {
                response.status(400).send(error);
                return;
            }

            Logs.error(error);
            ReplyError.replyServerError(response);
        }
    }
}
