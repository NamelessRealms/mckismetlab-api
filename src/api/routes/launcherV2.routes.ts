import { Application } from "express";
import LauncherController from "../controllers/launcher.controller";

import IRoutes from "./IRoutes";

export default class LauncherV2Router extends IRoutes {

    private _launcherController = new LauncherController();

    constructor(app: Application) {
        super(app, "/launcher/v2");
    }

    protected _loadRoutes(): void {

        this._routers.route("/assets")
            .get((req, res) => this._launcherController.getLauncherAssetsV2(req, res));

    }
}