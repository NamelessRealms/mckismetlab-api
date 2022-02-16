export default class VerifyRequest {

    public static verifyParameter(requestBody: any, verifyParameterMethod: Function): boolean {

        if (Array.isArray(requestBody)) {
            for (let body of requestBody) {
                if (!verifyParameterMethod(body)) {
                    return false;
                }
            }
        } else if (!verifyParameterMethod(requestBody)) {
            return false;
        }

        return true;
    }
}
