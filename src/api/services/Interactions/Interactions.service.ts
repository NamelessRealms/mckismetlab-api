export default class InteractionsService {

    public static pings = new Array<{ appId: string, ip: string, expired: number }>();
    public static interactionApps = new Map<string, { ip: string }>();

    public static initLoopPings(): void {
        setInterval(() => {

            InteractionsService.pings = InteractionsService.pings.filter((item) => {
                return Date.now() < item.expired + (5000 * 60);
            });

        }, 300000);
    }

    public addInteractionCallbackPing(appId: string, ip: string | undefined) {

        if (ip === undefined) {
            throw new Error("Interaction ip not null.");
        }

        ip = ip.indexOf("::ffff:") !== -1 ? ip.replace("::ffff:", "") : ip;

        const isIp = InteractionsService.pings.find((item) => item.ip === ip);

        if (isIp) {
            return;
        }

        InteractionsService.pings.push({
            appId: appId,
            ip: ip,
            expired: Date.now()
        });
    }

    public addInteractionCallback(appId: string, ip: string | undefined): boolean {

        if (ip === undefined) {
            throw new Error("Interaction ip not null.");
        }

        ip = ip.indexOf("::ffff:") !== -1 ? ip.replace("::ffff:", "") : ip;

        const isIp = InteractionsService.pings.find((item) => item.ip === ip);

        if (!isIp) {
            return false;
        }

        if (InteractionsService.interactionApps.get(appId) !== undefined) {
            InteractionsService.interactionApps.delete(appId);
        }

        InteractionsService.interactionApps.set(appId, { ip: ip });

        return true;
    }
}
