import { Application } from "express";
import InteractionsController from "../controllers/interactions.controller";

import IRoutes from "./IRoutes"

export default class InteractionsRouter extends IRoutes {

    private _interactionsController = new InteractionsController();

    constructor(app: Application) {
        super(app, "/interactions");
    }

    protected _loadRoutes(): void {

        this._routers.route("/:appId/callback")
            .post((req, res) => this._interactionsController.createInteraction(req, res));

        this._routers.route("/:appId/callback/ping")
            .post((req, res) => this._interactionsController.pingInteraction(req, res));

    }
}
