import Mysql from "../../utils/mysql";

export default class ViolationService {

    public getViolationUser(id: string): Promise<Array<any>> {
        return new Promise(async (resolve, reject) => {

            const allViolationUserData = await Mysql.getPool().query("SELECT * FROM violationlist WHERE minecraft_uuid = ? OR discord_id = ?", [id, id]);

            return resolve((allViolationUserData[0] as Array<any>));
        });
    }
}
