import { Socket } from "socket.io";
import SocketIo from "../SocketIo";
import ISockerEvent, { ContainerType, ICheckSocketConnection, IEventType } from "./ISockerEvent";

export default class CheckSocketConnection implements ISockerEvent<"CHECK_SOCKET_CONNECTION"> {

    public event: keyof IEventType = "CHECK_SOCKET_CONNECTION";

    public execute(socket: Socket, clientType: ContainerType, clientId: string, data: ICheckSocketConnection): void {
        const checkSocket = SocketIo.getSocket(data.clientType, data.clientId);
        socket.emit("CHECK_SOCKET_CONNECTION", checkSocket !== null);
    }
}