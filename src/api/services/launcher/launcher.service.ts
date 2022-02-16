import ICreateSql from "../../../interface/Sql/ICreateSql";
import file from "../../utils/file/file";
import Logs from "../../utils/logs";
import Mysql from "../../utils/mysql";
import got from "got";

export default class LauncherService {

    private _githubApiUrl = "https://api.github.com";

    public getLauncherAssets(): Promise<any> {
        return new Promise(async (resolve, reject) => {

            const launcherAssetsData = await Mysql.getPool().query("SELECT * FROM launcher_assets");

            return resolve((launcherAssetsData[0] as Array<any>)[0]);
        });
    }

    public getLauncherPage(): Promise<any> {
        return new Promise(async (resolve, reject) => {

            const launcherPageData = await Mysql.getPool().query("SELECT * FROM launcher_page");

            return resolve((launcherPageData[0] as Array<any>)[0]);
        });
    }

    public putLauncherAssets(jsonData: string): Promise<ICreateSql> {
        return new Promise(async (resolve, reject) => {
            try {

                await Mysql.getPool().query("UPDATE launcher_assets SET data = ? WHERE data_id = 1", [jsonData]);

                return resolve({
                    modified: true
                });

            } catch (error: any) {
                return reject(error);
            }
        });
    }

    public putLauncherPage(jsonData: string): Promise<ICreateSql> {
        return new Promise(async (resolve, reject) => {
            try {

                await Mysql.getPool().query("UPDATE launcher_page SET data = ? WHERE data_id = 1", [jsonData]);

                return resolve({
                    modified: true
                });

            } catch (error: any) {
                return reject(error);
            }
        });
    }

    public createIssuelogFile(requestBody: any): Promise<ICreateSql> {
        return new Promise((resolve, reject) => {
            try {

                const content = requestBody as { type: string, fileName: string, issueId: string, content: string };
                file.writeFile(content.type, content.fileName, content.issueId, content.content);

                return resolve({
                    modified: true
                });

            } catch (error: any) {
                return reject(error);
            }
        });
    }

    public async getGithubReleasesLatest(): Promise<any> {
        try {

            const response = await got.get<any>(`${this._githubApiUrl}/repos/QuasiMkl/mckismetlab-launcher/releases/latest`, {
                responseType: "json"
            });

            if(response.statusCode !== 200) {
                throw new Error(response.body);
            }

            return response.body;

        } catch (error: any) {
            throw new Error(error);
        }
    }
}
