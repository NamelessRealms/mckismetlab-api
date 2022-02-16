import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

import Mysql from "../../utils/mysql";

import { IUser } from "../../../interface/auth/IUser";
import { environment } from "../../../environment/environment";

export default class AuthService {

    /**
     *
     *
     * @param {*} verifyData
     * @return {*}  {Promise<string>}
     * @memberof AuthService
     */
    public async verify(verifyData: any): Promise<{ tokenCode: string, username: string, role: string[] }> {

        // 驗證 OAuth 2.0 授權類型
            if (!verifyData.grant_type || verifyData.grant_type !== "password") {
                throw {
                    error: "unsupported_response_type",
                    error_description: "授權伺服器不支援要求中的回應類型，本伺服器僅支持 Password 類型。"
                };
            }

            // 將明文密碼加密
            const passwordCrypto = crypto.createHash("md5").update(verifyData.password + process.env.JWT_SALT).digest("hex")

            // 使用者登入認證
            const results = await Mysql.getPool().query("SELECT * FROM users WHERE username = ? AND password = ?", [verifyData.username, passwordCrypto]);

            if (!(results[0] as Array<IUser>).length) {
                throw {
                    error: "invalid_client",
                    error_description: "用戶端驗證失敗。"
                };
            }

            // 產生 OAuth 2.0 和 JWT 的 JSON 格式令牌訊息
            const payload = {
                _id: (results[0] as Array<IUser>)[0].unique,
                iss: verifyData.username,
                sub: "Mkl System Web API",
                role: verifyData.role
            }

            const token = jwt.sign(payload, (process.env.JWT_SECRET as string), {
                algorithm: "HS256",
                expiresIn: `${environment.jwt.increaseTime}ms`
            });

            return {
                tokenCode: token,
                username: (results[0] as Array<IUser>)[0].username,
                role: (results[0] as Array<IUser>)[0].roles
            };
    }
}
