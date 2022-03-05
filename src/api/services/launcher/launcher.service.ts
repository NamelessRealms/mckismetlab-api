import ICreateSql from "../../../interface/Sql/ICreateSql";
import file from "../../utils/file/file";
import Logs from "../../utils/logs";
import Mysql from "../../utils/mysql";
import got from "got";

export default class LauncherService {

    private _githubApiUrl = "https://api.github.com";

    public async getLauncherAssets(): Promise<any> {
        const launcherAssetsData = await Mysql.getPool().query("SELECT * FROM launcher_assets");
        return (launcherAssetsData[0] as Array<any>)[0];
    }

    public async getLauncherAssetsV2(): Promise<any> {
        const launcherAssetsData = await Mysql.getPool().query("SELECT * FROM launcher_assets_v2");
        return (launcherAssetsData[0] as Array<any>)[0];
    }

    public async getLauncherPage(): Promise<any> {
        const launcherPageData = await Mysql.getPool().query("SELECT * FROM launcher_page");
        return (launcherPageData[0] as Array<any>)[0];
    }

    public async putLauncherAssets(jsonData: string): Promise<ICreateSql> {
        await Mysql.getPool().query("UPDATE launcher_assets SET data = ? WHERE data_id = 1", [jsonData]);
        return { modified: true };
    }

    public async putLauncherPage(jsonData: string): Promise<ICreateSql> {
        await Mysql.getPool().query("UPDATE launcher_page SET data = ? WHERE data_id = 1", [jsonData]);
        return { modified: true };
    }

    // public async createIssuelogFile(requestBody: any): Promise<ICreateSql> {
    //     const content = requestBody as { type: string, fileName: string, issueId: string, content: string };
    //     file.writeFile(content.type, content.fileName, content.issueId, content.content);
    //     return { modified: true };
    // }

    public async getGithubReleasesLatest(): Promise<any> {
        try {

            const response = await got.get<any>(`${this._githubApiUrl}/repos/QuasiMkl/mckismetlab-launcher/releases/latest`, {
                responseType: "json"
            });
    
            if (response.statusCode !== 200) {
                throw {
                    error: "get-api-statusCode-not-200",
                    error_description: "Get Api status code no 200."
                };
            }
    
            return response.body;

        } catch (error: any) {
            throw {
                error: "github-api-offline",
                error_description: "第三方API離線"
            };
        }
    }
}
