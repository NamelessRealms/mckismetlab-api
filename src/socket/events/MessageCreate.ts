import { Socket } from "socket.io";
import SocketIo from "../SocketIo";
import ISockerEvent, { ContainerType, IEventType, IMessageDiscord, IMessageMcServer } from "./ISockerEvent";

export default class MessageEvent implements ISockerEvent<"MESSAGE_CREATE"> {

    public event: keyof IEventType = "MESSAGE_CREATE";

    public execute(socket: Socket, clientType: ContainerType, clientId: string, message: IMessageDiscord | IMessageMcServer): void {

        if(clientType === "mcServer") {

            const mainDiscordSocket = SocketIo.getSocket("Discord", "main");
            if(mainDiscordSocket === null) return;

            mainDiscordSocket.emit(this.event, { ...message as IMessageMcServer, serverId: clientId });

            return;
        }

        if(clientType === "Discord") {

            const messageAs = message as IMessageDiscord;
            const mcServerSocket = SocketIo.getSocket("mcServer", messageAs.serverId);
            if(mcServerSocket === null) return;

            mcServerSocket.emit(this.event, message);

            return;
        }

    }
}