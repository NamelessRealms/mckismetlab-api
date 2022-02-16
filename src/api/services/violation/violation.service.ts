import Mysql from "../../utils/mysql";

export default class ViolationService {

    public async getViolationUser(id: string): Promise<Array<any>> {
        const allViolationUserData = await Mysql.getPool().query("SELECT * FROM violationlist WHERE minecraft_uuid = ? OR discord_id = ?", [id, id]);
        return (allViolationUserData[0] as Array<any>);
    }
}
