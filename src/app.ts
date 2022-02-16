import * as express from "express";
import * as path from "path";
import * as morgan from "morgan";
import * as helmet from "helmet";
import * as cookieParser from "cookie-parser";
// import * as session from "express-session";

// route
import IndexRoutes from "./api/routes/index.routes";
import AuthRoutes from "./api/routes/auth.routes";
import WhitelistRoutes from "./api/routes/whitelist.routes";
import UserRouter from "./api/routes/user.routes";
import SponsorRouter from "./api/routes/sponsor.routes";
import ViolationRouter from "./api/routes/violation.routes";
import LauncherRouter from "./api/routes/launcher.routes";
import InteractionsRouter from "./api/routes/interactions.routes";

import Mysql from "./api/utils/mysql";
import Logs from "./api/utils/logs";

// environment
import { environment } from "./environment/environment";
import LauncherOldRouter from "./api/routes/launcherOld.routes";
import InteractionsService from "./api/services/Interactions/Interactions.service";

export default class App {

    private _app: express.Application;
    private _morganFormat = '[:date[iso]] :remote-addr - :remote-user ":method :url :status :response-time ms';
    // private _mySQLStore = require("express-mysql-session")(session);

    // private _sessionOptions = {
    //     secret: "@@!!@@",
    //     resave: false,
    //     saveUninitialized: true,
    //     store: new this._mySQLStore({
    //         host: process.env.MYSQL_HOST,
    //         user: process.env.MYSQL_USER,
    //         password: process.env.MYSQL_PASSWORD,
    //         database: process.env.MYSQL_DATABASE
    //     })
    // }

    constructor() {
        this._app = express();
        this._init();
        this._settings();
        this._middleware();
        this._routes();
    }

    private _init(): void {
        Logs.info(`Api Service start model: ${process.env.NODE_ENV}`);
        Logs.info(`Api Service Version: ${environment.api_version}`);
        Mysql.connect();
        InteractionsService.initLoopPings();
    }

    private _settings(): void {
        this._app.set("views", path.join(__dirname, "views"));
        this._app.set("view engine", "ejs");
    }

    private _middleware(): void {
        this._app.use(helmet());
        this._app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : this._morganFormat));
        this._app.use(express.json({ limit: "10MB" }));
        this._app.use(express.static(path.join(__dirname, "public")));
        this._app.use(express.urlencoded({ extended: true }));
        this._app.use(cookieParser());
        // this._app.use(session(this._sessionOptions));
    }

    private _routes(): void {

        new IndexRoutes(this._app);
        new AuthRoutes(this._app);
        new WhitelistRoutes(this._app);
        new UserRouter(this._app);
        new SponsorRouter(this._app);
        new ViolationRouter(this._app);
        new LauncherRouter(this._app);
        // new InteractionsRouter(this._app);

        // old
        new LauncherOldRouter(this._app);
    }

    public listen(port: number): void {
        this._app.set("port", port || 3000);
        this._app.listen(port, () => {
            Logs.info("Api Service listening on PORT " + this._app.get("port"));
        });
    }
}
