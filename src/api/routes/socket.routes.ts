import { Application } from "express";

import IRoutes from "./IRoutes";

export default class SocketRouter extends IRoutes {

    constructor(app: Application) {
        super(app, "/socket");
    }

    protected _loadRoutes(): void {

        this._routers
            .get("/newOrder", (req, res) => {

                (req.app as any).io.emit('newOrder', { hasOrder: true });
                res.status(201).end();

            });

    }
}