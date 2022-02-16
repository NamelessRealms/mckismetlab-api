import { Application } from "express";
import { environment } from "../../environment/environment";

import IRoutes from "./IRoutes";

export default class IndexRoutes extends IRoutes {

    constructor(app: Application) {
        super(app);
    }

    protected _loadRoutes(): void {

        this._routers.get("/", (req, res) => {
            res.render("index", { version: environment.api_version });
        });

        /**
        * GET /status
        */
        this._routers.get("/status", (req, res) => {
            res.status(200).json({
                message: "OK",
                timestamp: new Date().toISOString(),
                ip: req.ip,
                url: req.originalUrl,
            });
        });

    }
}
