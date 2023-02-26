import { Application } from "express";

import SponsorController from "../controllers/sponsor.controller";
import IRoutes from "./IRoutes";

export default class SponsorRouter extends IRoutes {

    private _sponsorController = new SponsorController();

    constructor(app: Application) {
        super(app, "/sponsor");
    }

    protected _loadRoutes(): void {

        this._routers.route("/user")
            .get((req, res) => this._sponsorController.getAllSponsorUser(req, res))
            .post(this._authJwtVerify.verifyToken, (req, res) => this._sponsorController.createSponsorUser(req, res));

        // this._routers.route("/users")
        //     .post(this._authJwtVerify.verifyToken, (req, res) => this._sponsorController.getAllSponsorUser(req, res));

        this._routers.route("/user/:uuid")
            .get((req, res) => this._sponsorController.getSponsorUser(req, res))
            .patch(this._authJwtVerify.verifyToken, (req, res) => this._sponsorController.patchSponsorUser(req, res))
            .delete(this._authJwtVerify.verifyToken, (req, res) => this._sponsorController.deleteSponsorUser(req, res));
    }
}
