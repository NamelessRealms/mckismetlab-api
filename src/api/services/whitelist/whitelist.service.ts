import ICreateSql from "../../../interface/Sql/ICreateSql";
import IAwaitVerify from "../../../interface/whitelist/IAwaitVerify";
import IManualVerify from "../../../interface/whitelist/IManualVerify";
import IServerWhilelist from "../../../interface/whitelist/IServerWhilelist";
import TpmeVerifyWhitelist from "../../../interface/whitelist/ITpmeVerifyWhitelist";
import Sql from "../../utils/database/sql";
import Mysql from "../../utils/mysql";

export default class WhitelistService {

    public createAwaitVerify(requestBody: IAwaitVerify | IAwaitVerify[]): Promise<ICreateSql> {
        return new Promise(async (resolve, reject) => {

            const createSqlDataMethod = (body: IAwaitVerify): Promise<ICreateSql> => {
                return new Promise(async (resolve, reject) => {
                    try {

                        const awaitVerifyData = await Mysql.getPool().query("SELECT * FROM awaitVerify_whitelist WHERE discord_id = ?", [body.discord_id]);
                        const isData = (awaitVerifyData[0] as Array<IAwaitVerify>).length === 0;

                        if (isData) {
                            await Mysql.getPool().query("INSERT INTO awaitVerify_whitelist SET ?", [body]);
                        }

                        return resolve({
                            modified: isData
                        });

                    } catch (error: any) {
                        reject(error);
                    }
                });
            }

            try {

                const { modified } = await Sql.createSqlData(requestBody, createSqlDataMethod);

                resolve({
                    modified: modified
                });

            } catch (error: any) {
                reject(error);
            }

        });
    }

    public getAwaitVerify(discordId: string): Promise<any> {
        return new Promise(async (resolve, reject) => {

            const awaitVerifyData = await Mysql.getPool().query("SELECT * FROM awaitVerify_whitelist WHERE discord_id = ?", [discordId]);

            return resolve((awaitVerifyData[0] as Array<any>)[0]);
        });
    }

    public deleteAwaitVerify(discordId: string): Promise<void> {
        return new Promise(async (resolve, reject) => {

            await Mysql.getPool().query("DELETE FROM awaitVerify_whitelist WHERE discord_id = ?", [discordId]);

            resolve();
        });
    }

    public getAllManualVerify(): Promise<any> {
        return new Promise(async (resolve, reject) => {

            const allManualVerifyData = await Mysql.getPool().query("SELECT * FROM manualVerify_whitelist");

            return resolve(allManualVerifyData[0]);
        });
    }

    public createManualVerify(requestBody: IManualVerify | IManualVerify[]): Promise<{ modified: boolean }> {
        return new Promise(async (resolve, reject) => {

            const createSqlDataMethod = (body: IManualVerify): Promise<{ modified: boolean }> => {
                return new Promise(async (resolve, reject) => {
                    try {

                        const awaitVerifyData = await Mysql.getPool().query("SELECT * FROM manualVerify_whitelist WHERE discord_user_id = ?", [body.discord_user_id]);
                        const isData = (awaitVerifyData[0] as Array<IManualVerify>).length === 0;

                        if (isData) {
                            await Mysql.getPool().query("INSERT INTO manualVerify_whitelist SET ?", [body]);
                        }

                        return resolve({
                            modified: isData
                        });

                    } catch (error: any) {
                        reject(error);
                    }
                });
            }

            try {

                const { modified } = await Sql.createSqlData(requestBody, createSqlDataMethod);

                resolve({
                    modified: modified
                });

            } catch (error: any) {
                reject(error);
            }

        });
    }

    public getManualVerify(discordUserId: string): Promise<any> {
        return new Promise(async (resolve, reject) => {

            const manualVerifyData = await Mysql.getPool().query("SELECT * FROM manualVerify_whitelist WHERE discord_user_id = ?", [discordUserId]);

            return resolve((manualVerifyData[0] as Array<any>)[0]);
        });
    }

    public getManualVerifyCIdMId(channelId: string, messageId: string): Promise<any> {
        return new Promise(async (resolve, reject) => {

            const manualVerifyData = await Mysql.getPool().query("SELECT * FROM manualVerify_whitelist WHERE channel_id = ? AND message_id = ?", [channelId, messageId]);

            return resolve((manualVerifyData[0] as Array<any>)[0]);
        });
    }

    public deleteManualVerify(channelId: string, messageId: string): Promise<void> {
        return new Promise(async (resolve, reject) => {

            await Mysql.getPool().query("DELETE FROM manualVerify_whitelist WHERE channel_id = ? AND message_id = ?", [channelId, messageId]);

            resolve();
        });
    }

    public getAllServerWhitelist(): Promise<Array<any>> {
        return new Promise(async (resolve, reject) => {

            const allServerWhitelistData = await Mysql.getPool().query("SELECT * FROM server_whitelist");

            return resolve((allServerWhitelistData[0] as Array<any>));
        });
    }

    public createServerWhitelist(requestBody: IServerWhilelist | IServerWhilelist[]): Promise<{ modified: boolean }> {
        return new Promise(async (resolve, reject) => {

            const createSqlDataMethod = (body: IServerWhilelist): Promise<{ modified: boolean }> => {
                return new Promise(async (resolve, reject) => {
                    try {

                        const serverWhitelistData = await Mysql.getPool().query("SELECT * FROM server_whitelist WHERE minecraft_uuid = ? AND server_id = ?", [body.minecraft_uuid, body.server_id]);
                        const isData = (serverWhitelistData[0] as Array<IServerWhilelist>).length === 0;

                        if (isData) {
                            await Mysql.getPool().query("INSERT INTO server_whitelist SET ?", [body]);
                        }

                        return resolve({
                            modified: isData
                        });

                    } catch (error: any) {
                        reject(error);
                    }
                });
            }

            try {

                const { modified } = await Sql.createSqlData(requestBody, createSqlDataMethod);

                resolve({
                    modified: modified
                });

            } catch (error: any) {
                reject(error);
            }

        });
    }

    public getServerWhitelist(minecraftUUID: string): Promise<any> {
        return new Promise(async (resolve, reject) => {

            const serverWhitelistData = await Mysql.getPool().query("SELECT * FROM server_whitelist WHERE minecraft_uuid = ?", [minecraftUUID]);

            return resolve((serverWhitelistData[0] as Array<any>)[0]);
        });
    }

    public getServerWhitelistServerId(minecraftUUID: string, serverId: string): Promise<any> {
        return new Promise(async (resolve, reject) => {

            const serverWhitelistData = await Mysql.getPool().query("SELECT * FROM server_whitelist WHERE minecraft_uuid = ? AND server_id = ?", [minecraftUUID, serverId]);

            return resolve((serverWhitelistData[0] as Array<any>)[0]);
        });
    }

    public deleteServerWhitelist(minecraftUUID: string): Promise<void> {
        return new Promise(async (resolve, reject) => {

            await Mysql.getPool().query("DELETE FROM server_whitelist WHERE minecraft_uuid = ?", [minecraftUUID]);

            resolve();
        });
    }

    public createTpmeVerifyWhitelist(requestBody: TpmeVerifyWhitelist | TpmeVerifyWhitelist[]): Promise<ICreateSql> {
        return new Promise(async (resolve, reject) => {

            const createSqlDataMethod = (body: TpmeVerifyWhitelist): Promise<ICreateSql> => {
                return new Promise(async (resolve, reject) => {
                    try {

                        const tpmeVerifyWhitelistData = await Mysql.getPool().query("SELECT * FROM tpme_verify_whitelist WHERE discord_user_id = ?", [body.discord_user_id]);
                        const isData = (tpmeVerifyWhitelistData[0] as Array<TpmeVerifyWhitelist>).length === 0;

                        if (isData) {
                            await Mysql.getPool().query("INSERT INTO tpme_verify_whitelist SET ?", [body]);
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

    public getAllTpmeVerifyWhitelist(): Promise<Array<any>> {
        return new Promise(async (resolve, reject) => {

            const tpmeVerifyWhitelistData = await Mysql.getPool().query("SELECT * FROM tpme_verify_whitelist");

            return resolve(tpmeVerifyWhitelistData[0] as Array<any>);
        });
    }

    public deleteTpmeVerifyWhitelist(discordUserId: string): Promise<void> {
        return new Promise(async (resolve, reject) => {

            await Mysql.getPool().query("DELETE FROM tpme_verify_whitelist WHERE discord_user_id = ?", [discordUserId]);

            resolve();
        });
    }
}
