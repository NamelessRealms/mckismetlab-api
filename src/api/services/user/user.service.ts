import ICreateSql from "../../../interface/Sql/ICreateSql";
import IUserLink from "../../../interface/user/IUserLink";
import Sql from "../../utils/database/sql";
import Mysql from "../../utils/mysql";
import InteractionsService from "../Interactions/Interactions.service";

export default class UserService {

    public async getAllUserLink(): Promise<Array<any>> {
        const userLinkData = await Mysql.getPool().query("SELECT * FROM user_link");
        return (userLinkData[0] as Array<any>);
    }

    public createUserLink(requestBody: IUserLink | IUserLink[]): Promise<ICreateSql> {
        return new Promise(async (resolve, reject) => {

            const createSqlDataMethod = (body: IUserLink): Promise<ICreateSql> => {
                return new Promise(async (resolve, reject) => {
                    try {

                        const userLinkData = await Mysql.getPool().query("SELECT * FROM user_link WHERE minecraft_uuid = ? AND discord_id = ?", [body.minecraft_uuid, body.discord_id]);
                        const isData = (userLinkData[0] as Array<IUserLink>).length === 0;

                        if (isData) {
                            await Mysql.getPool().query("INSERT INTO user_link SET ?", [body]);
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

    public getUserLink(requestBody: string): Promise<any> {
        return new Promise(async (resolve, reject) => {

            const userLinkData = await Mysql.getPool().query("SELECT * FROM user_link WHERE minecraft_uuid = ? OR discord_id = ?", [requestBody, requestBody]);

            return resolve((userLinkData[0] as Array<any>)[0]);
        });
    }

    public getPlayerRole(minecraftUUID: string): Promise<any> {
        return new Promise(async (resolve, reject) => {

            const sponsorData = await Mysql.getPool().query("SELECT * FROM sponsor_userlist WHERE minecraft_uuid = ?", [minecraftUUID]);
            const userLinkData = await Mysql.getPool().query("SELECT * FROM user_link WHERE minecraft_uuid = ?", [minecraftUUID]);

            return resolve({
                sponsor: (sponsorData[0] as Array<any>).length !== 0,
                userLink: (userLinkData[0] as Array<any>).length !== 0,
                uuid: minecraftUUID
            });
        });
    }
}
