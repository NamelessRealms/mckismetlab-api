import { Application } from "express";

import LauncherController from "../controllers/launcher.controller";
import IRoutes from "./IRoutes"

export default class LauncherRouter extends IRoutes {

    private _launcherController = new LauncherController();

    constructor(app: Application) {
        super(app, "/launcher");
    }

    protected _loadRoutes(): void {

        this._routers.route("/assets")
            .get((req, res) => this._launcherController.getLauncherAssets(req, res));

        this._routers.route("/page")
            .get((req, res) => this._launcherController.getLauncherPage(req, res))
            .put((req, res) => this._launcherController.putLauncherPage(req, res));

        // this._routers.route("/logFile")
        //     .post((req, res) => this._launcherController.createIssuelogFile(req, res));

        this._routers.route("/autoUpdater/updates/RELEASES")
            .get((req, res) => this._launcherController.getAutoUpdaterLatest(req, res));

        this._routers.route("/autoUpdater/updates/:fileName")
            .get((req, res) => this._launcherController.getAutoUpdaterLatestNupkg(req, res));
    }
}
