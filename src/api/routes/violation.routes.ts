import { Application } from "express";

import ViolationController from "../controllers/violation.controller";
import IRoutes from "./IRoutes";

export default class ViolationRouter extends IRoutes {

    private _violationController = new ViolationController();

    constructor(app: Application) {
        super(app, "/violation");
    }

    protected _loadRoutes(): void {

        this._routers.route("/user/:id")
            .get((req, res) => this._violationController.getViolationUser(req, res));

    }
}
