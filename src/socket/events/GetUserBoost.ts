import { Socket } from "socket.io";
import SocketIo from "../SocketIo";
import ISockerEvent, { ContainerType, IEventType, IGetUserBoostDiscord, IGetUserBoostMcServer } from "./ISockerEvent";

export default class GetUserBoost implements ISockerEvent<"GET_USER_BOOST"> {

    public event: keyof IEventType = "GET_USER_BOOST";

    public execute(socket: Socket, clientType: ContainerType, clientId: string, user: IGetUserBoostMcServer | IGetUserBoostDiscord): void {

        if(clientType === "mcServer") {

            const mainDiscordSocket = SocketIo.getSocket("Discord", "main");
            if(mainDiscordSocket === null) return;

            mainDiscordSocket.emit(this.event, { uuid: user, serverId: clientId });

            return;
        }

        if(clientType === "Discord") {

            const userAs = user as IGetUserBoostDiscord;
            const mcServerSocket = SocketIo.getSocket("mcServer", userAs.serverId);
            if(mcServerSocket === null) return;

            mcServerSocket.emit(this.event, userAs.boostRole);

            return;
        }

    }

}