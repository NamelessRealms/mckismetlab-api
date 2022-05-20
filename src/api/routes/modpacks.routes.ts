import { Application } from "express";
import ModsController from "../controllers/mods.controller";

import IRoutes from "./IRoutes";

export default class ModpacksRoutes extends IRoutes {

    private _modsController = new ModsController();

    constructor(app: Application) {
        super(app, "/modpacks");
    }

    protected _loadRoutes(): void {
        this._routers.route("/:projectId/file/:fileId")
            .get((req, res) => this._modsController.getMod(req, res));
    }
}
