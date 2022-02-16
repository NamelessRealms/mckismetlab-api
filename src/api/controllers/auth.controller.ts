import { Request, Response } from "express";
import { environment } from "../../environment/environment";

import { IOAuth2 } from "../../interface/auth/IOAuth2";
import AuthService from "../services/auth/auth.service";

export default class AuthController {

    private _authService = new AuthService();

    public async login(request: Request, response: Response) {

        const bodyData: IOAuth2 = request.body;

        // 確保客戶端必要的參數
        if (!this._verifyRequest(bodyData)) {
            return response.status(400).json({
                error: "invalid_request",
                error_description: "通訊協定錯誤，遺漏必要的參數。"
            });
        }

        try {

            const verifyData = await this._authService.verify(bodyData);

            // 確保客戶端不會緩存此請求
            response.header("Cache-Control", "no-store");
            response.header("Pragma", "no-cache");

            return response.status(200).json({
                access_token: verifyData.tokenCode,
                token_type: "bearer",
                expires_in: new Date().getTime() + environment.jwt.increaseTime,
                scope: verifyData.role,
                info: {
                    username: verifyData.username
                }
            });

        } catch (error: any) {

            if (error.error === "invalid_client" || error.error === "unsupported_response_type") {
                return response.status(400).json({
                    error: error.error,
                    error_description: error.error_description
                });
            }

            return response.status(400).json({
                error: "server_error",
                error_description: "伺服器發生非預期的錯誤。"
            });

        }
    }

    private _verifyRequest(requestBody: any): boolean {

        if (!requestBody.hasOwnProperty("grant_type")) {
            return false;
        }

        if (!requestBody.hasOwnProperty("username")) {
            return false;
        }

        if (!requestBody.hasOwnProperty("password")) {
            return false;
        }

        return true;
    }
}
