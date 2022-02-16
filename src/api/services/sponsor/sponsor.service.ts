import ISponsorUser from "../../../interface/sponsor/ISponsorUser";
import ICreateSql from "../../../interface/Sql/ICreateSql";
import Sql from "../../utils/database/sql";
import Mysql from "../../utils/mysql";

export default class SponsorService {

    public getAllSponsorUser(): Promise<Array<any>> {
        return new Promise(async (resolve, reject) => {

            const sponsorUserListData = await Mysql.getPool().query("SELECT * FROM sponsor_userlist");

            return resolve((sponsorUserListData[0] as Array<any>));
        });
    }

    public createSponsorUser(requestBody: ISponsorUser | ISponsorUser[]): Promise<ICreateSql> {
        return new Promise(async (resolve, reject) => {

            const createSqlDataMethod = (body: ISponsorUser): Promise<ICreateSql> => {
                return new Promise(async (resolve, reject) => {
                    try {

                        const sponsorUserlistData = await Mysql.getPool().query("SELECT * FROM sponsor_userlist WHERE minecraft_uuid = ?", [body.minecraft_uuid]);
                        const isData = (sponsorUserlistData[0] as Array<ISponsorUser>).length === 0;

                        if (isData) {
                            await Mysql.getPool().query("INSERT INTO sponsor_userlist SET ?", [body]);
                        }

                        return resolve({
                            modified: isData
                        });

                    } catch (error: any) {
                        return reject(error);
                    }
                });
            }

            try {

                const { modified } = await Sql.createSqlData(requestBody, createSqlDataMethod);

                resolve({
                    modified: modified
                });

            } catch (error: any) {
                return reject(error);
            }
        });
    }

    public patchSponsorUser(minecraftUUID: string, money: number): Promise<{ modified: boolean, info: { minecraft_uuid: string, money: number } }> {
        return new Promise(async (resolve, reject) => {

            try {

                const sponsorUser = await Mysql.getPool().query("SELECT * FROM sponsor_userlist WHERE minecraft_uuid = ?", [minecraftUUID]);
                const isData = (sponsorUser[0] as Array<ISponsorUser>).length === 0;

                if (isData) {
                    return reject({
                        error: "not_replace_data",
                        error_description: "沒有可替換的資源，請先新增資源。"
                    });
                }

                const addSum = Number((sponsorUser[0] as Array<ISponsorUser>)[0].money) + money;
                await Mysql.getPool().query("UPDATE sponsor_userlist SET money = ? WHERE minecraft_uuid = ?", [addSum, minecraftUUID]);

                resolve({
                    modified: true,
                    info: {
                        minecraft_uuid: minecraftUUID,
                        money: addSum
                    }
                });

            } catch (error: any) {
                return reject(error);
            }

        });
    }

    public deleteSponsorUser(minecraftUUID: string): Promise<void> {
        return new Promise(async (resolve, reject) => {

            await Mysql.getPool().query("DELETE FROM sponsor_userlist WHERE minecraft_uuid = ?", [minecraftUUID]);

            resolve();
        });
    }

    public getSponsorUser(minecraftUUID: string): Promise<any> {
        return new Promise(async (resolve, reject) => {

            const sponsorUserData = await Mysql.getPool().query("SELECT * FROM sponsor_userlist WHERE minecraft_uuid = ?", [minecraftUUID]);

            return resolve((sponsorUserData[0] as Array<any>)[0]);
        });
    }
}
