import { Application } from "express";
import ModsController from "../controllers/mods.controller";

import IRoutes from "./IRoutes";

export default class ModsRoutes extends IRoutes {

    private _modsController = new ModsController();

    constructor(app: Application) {
        super(app, "/mods");
    }

    protected _loadRoutes(): void {
        this._routers
            .post("", (req, res) => this._modsController.getMods(req, res));
        this._routers
            .post("/files", (req, res) => this._modsController.getModFiles(req, res));
        this._routers.route("/:projectId/file/:fileId")
            .get((req, res) => this._modsController.getMod(req, res));
    }
}
