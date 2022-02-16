import { Application } from "express";

import IRoutes from "./IRoutes";
import UserController from "../controllers/user.controller";

export default class UserRouter extends IRoutes {

    private _userController = new UserController();

    constructor(app: Application) {
        super(app, "/user");
    }

    protected _loadRoutes(): void {

        this._routers.route("/userLink")
            .get((req, res) => this._userController.getAllUserLink(req, res))
            .post(this._authJwtVerify.verifyToken, (req, res) => this._userController.createUserLink(req, res));

        // id: minecraft player uuid or discord user id
        this._routers.route("/userLink/:id")
            .get((req, res) => this._userController.getUserLink(req, res));

        this._routers.route("/playerRole/:minecraftUUID")
            .get((req, res) => this._userController.getPlayerRole(req, res));
    }
}
