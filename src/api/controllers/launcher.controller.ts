import { Request, Response } from "express";

import LauncherService from "../services/launcher/launcher.service";
import Logs from "../utils/logs";
import Utils from "../utils/utils";
import ReplyError from "../utils/response/replyError";
import VerifyRequestParameter from "../utils/verify/verifyRequestParameter";

import * as path from "path";

export default class LauncherController {

    private _launcherService = new LauncherService();

    public async getLauncherAssets(request: Request, response: Response): Promise<void> {

        const launcherAssetsData = await this._launcherService.getLauncherAssets();

        response.status(200).json(launcherAssetsData);
    }

    public async getLauncherAssetsV2(request: Request, response: Response): Promise<void> {

        const launcherAssetsV2Data = await this._launcherService.getLauncherAssetsV2();

        response.status(200).json(launcherAssetsV2Data);
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

            // windows
            // TODO: not osx
            const githubReleasesLatest = await this._launcherService.getGithubReleasesLatest();

            const releaseData = await githubReleasesLatest.assets.find((item: any) => item.name === "RELEASES");
            response.redirect(releaseData.browser_download_url);

            // const clientVersion = request.query.version as string;
            // const githubReleasesLatest = await this._launcherService.getGithubReleasesLatest();
            // const releasesLatestVersion = (githubReleasesLatest.tag_name as string).replace("v", "");

            // if (clientVersion === releasesLatestVersion) {
            //     response.status(204).end();
            //     return;
            // }

            // if (Utils.isVersion(releasesLatestVersion.split("-")[0], clientVersion.split("-")[0])) {
            //     response.status(204).end();
            //     return;
            // }

            // const exeData = await githubReleasesLatest.assets.find((item: any) => path.extname(item.name) === ".exe");
            // if (exeData === undefined) throw new Error("Find 'githubReleasesLatest' not null.");

            // response.json({
            //     url: exeData.browser_download_url
            // });

        } catch (error: any) {

            if (error.error === "get-api-statusCode-not-200" || error.error === "github-api-offline") {
                response.status(400).send(error);
                return;
            }

            Logs.error(error);
            ReplyError.replyServerError(response);
        }
    }

    public async getAutoUpdaterLatestNupkg(request: Request, response: Response): Promise<void> {
        try {

            const fileName = request.params.fileName;
            const githubReleasesLatest = await this._launcherService.getGithubReleasesLatest();
            const nupkgData = await githubReleasesLatest.assets.find((item: any) => item.name === fileName); 
            
            response.redirect(nupkgData.browser_download_url);

        } catch (error: any) {
            Logs.error(error);
            ReplyError.replyServerError(response);
        }
    }
}
