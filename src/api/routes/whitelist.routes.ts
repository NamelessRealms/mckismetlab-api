import { Application } from "express";

import WhitelistController from "../controllers/whitelist.controllers";
import IRoutes from "./IRoutes";

export default class WhitelistRoutes extends IRoutes {

    private _whitelistController = new WhitelistController();

    constructor(app: Application) {
        super(app, "/whitelist");
    }

    protected _loadRoutes(): void {

        this._routers.route("/awaitVerify")
            .post(this._authJwtVerify.verifyToken, (req, res) => this._whitelistController.createAwaitVerify(req, res));

        this._routers.route("/awaitVerify/:discordId")
            .get((req, res) => this._whitelistController.getAwaitVerify(req, res))
            .delete(this._authJwtVerify.verifyToken, (req, res) => this._whitelistController.deleteAwaitVerify(req, res));

        this._routers.route("/manualVerify")
            .get((req, res) => this._whitelistController.getAllManualVerify(req, res))
            .post(this._authJwtVerify.verifyToken, (req, res) => this._whitelistController.createManualVerify(req, res));

        this._routers.route("/manualVerify/:discordUserId")
            .get((req, res) => this._whitelistController.getManualVerify(req, res));

        this._routers.route("/manualVerify/:channelId/:messageId")
            .get((req, res) => this._whitelistController.getManualVerifyCIdMId(req, res))
            .delete(this._authJwtVerify.verifyToken, (req, res) => this._whitelistController.deleteManualVerify(req, res));

        this._routers.route("/serverWhitelist")
            .get((req, res) => this._whitelistController.getAllServerWhitelist(req, res))
            .post(this._authJwtVerify.verifyToken, (req, res) => this._whitelistController.createServerWhitelist(req, res));

        this._routers.route("/serverWhitelist/:serverId")
            .get((req, res) => this._whitelistController.getAllServerWhitelist(req, res));

        this._routers.route("/serverWhitelist/:minecraftUUID")
            .get((req, res) => this._whitelistController.getServerWhitelist(req, res))
            .delete(this._authJwtVerify.verifyToken, (req, res) => this._whitelistController.deleteServerWhitelist(req, res));

        this._routers.route("/serverWhitelist/:minecraftUUID/:serverId")
            .get((req, res) => this._whitelistController.getServerWhitelistServerId(req, res));

        this._routers.route("/tpmeVerifyWhitelist")
            .get((req, res) => this._whitelistController.getAllTpmeVerifyWhitelist(req, res))
            .post(this._authJwtVerify.verifyToken, (req, res) => this._whitelistController.createTpmeVerifyWhitelist(req, res));

        this._routers.route("/tpmeVerifyWhitelist/:discordUserId")
            .delete(this._authJwtVerify.verifyToken, (req, res) => this._whitelistController.deleteTpmeVerifyWhitelist(req, res));
    }
}
