import { Application } from "express";

import LauncherController from "../controllers/launcher.controller";
import IRoutes from "./IRoutes"

export default class LauncherOldRouter extends IRoutes {

    private _launcherController = new LauncherController();

    constructor(app: Application) {
        super(app);
    }

    protected _loadRoutes(): void {

        this._routers.route("/launcherAssets")
            .get((req, res) => this._launcherController.getLauncherAssets(req, res));

        this._routers.route("/launcherServerPage")
            .get((req, res) => this._launcherController.getLauncherPage(req, res));
    }
}
