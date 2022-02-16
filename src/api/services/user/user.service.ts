import ICreateSql from "../../../interface/Sql/ICreateSql";
import IUserLink from "../../../interface/user/IUserLink";
import Sql from "../../utils/database/sql";
import Mysql from "../../utils/mysql";

export default class UserService {

    public async getAllUserLink(): Promise<Array<any>> {
        const userLinkData = await Mysql.getPool().query("SELECT * FROM user_link");
        return (userLinkData[0] as Array<any>);
    }

    public async createUserLink(requestBody: IUserLink | IUserLink[]): Promise<ICreateSql> {

        const createSqlDataMethod = async (body: IUserLink): Promise<ICreateSql> => {
            try {

                const userLinkData = await Mysql.getPool().query("SELECT * FROM user_link WHERE minecraft_uuid = ? AND discord_id = ?", [body.minecraft_uuid, body.discord_id]);
                const isData = (userLinkData[0] as Array<IUserLink>).length === 0;

                if (isData) {
                    await Mysql.getPool().query("INSERT INTO user_link SET ?", [body]);
                }

                return {
                    modified: isData
                };

            } catch (error: any) {
                throw new Error(error);
            }
        }

        try {

            const { modified } = await Sql.createSqlData(requestBody, createSqlDataMethod);

            return {
                modified: modified
            };

        } catch (error: any) {
            throw new Error(error);
        }
    }

    public async getUserLink(requestBody: string): Promise<any> {
        const userLinkData = await Mysql.getPool().query("SELECT * FROM user_link WHERE minecraft_uuid = ? OR discord_id = ?", [requestBody, requestBody]);
        return (userLinkData[0] as Array<any>)[0];
    }

    public async getPlayerRole(minecraftUUID: string): Promise<any> {
        const sponsorData = await Mysql.getPool().query("SELECT * FROM sponsor_userlist WHERE minecraft_uuid = ?", [minecraftUUID]);
        const userLinkData = await Mysql.getPool().query("SELECT * FROM user_link WHERE minecraft_uuid = ?", [minecraftUUID]);

        return {
            sponsor: (sponsorData[0] as Array<any>).length !== 0,
            userLink: (userLinkData[0] as Array<any>).length !== 0,
            uuid: minecraftUUID
        };
    }
}
