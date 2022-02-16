import ICreateSql from "../../../interface/Sql/ICreateSql";

export default class Sql {

    public static createSqlData(requestBody: any, createSqlDataMethod: Function): Promise<ICreateSql> {
        return new Promise(async (resolve, reject) => {
            try {

                let modified = false;

                if (Array.isArray(requestBody)) {

                    const runSqlDataModified = new Array<boolean>();

                    for (let body of requestBody) {
                        const { modified } = await createSqlDataMethod(body);
                        runSqlDataModified.push(modified);
                    }

                    for (let modify of runSqlDataModified) {
                        if (modify) {
                            modified = true;
                            break;
                        }
                    }

                } else {

                    const runSql = await createSqlDataMethod(requestBody);
                    modified = runSql.modified;

                }

                return resolve({
                    modified: modified
                });

            } catch (error: any) {

                reject(error);

            }
        });
    }

}
