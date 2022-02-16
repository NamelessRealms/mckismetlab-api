export interface IUser {
    id: number;
    unique: string;
    username: string;
    password: string;
    roles: Array<string>;
}
