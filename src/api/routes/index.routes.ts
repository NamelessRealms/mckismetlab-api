import { Application } from "express";
import { environment } from "../../environment/environment";
import { Request, Response } from "express";

import IRoutes from "./IRoutes";

export default class IndexRoutes extends IRoutes {

    constructor(app: Application) {
        super(app);
    }

    protected _loadRoutes(): void {

        this._routers.get("/", (req, res) => {
            // res.render("index", { version: environment.api_version });
            this.sendStatusResponse(req, res);
        });

        /**
        * GET /status
        */
        this._routers.get("/status", (req, res) => {
            this.sendStatusResponse(req, res);
        });

    }

    public sendStatusResponse(request: Request, response: Response) {
        response.status(200).json({
            message: "OK",
            version: environment.api_version,
            timestamp: new Date().toISOString(),
            ip: request.ip,
            url: request.originalUrl,
        });
    }
}
