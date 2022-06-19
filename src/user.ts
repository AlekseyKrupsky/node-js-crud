import { v1 as uuid, validate as validateUUID } from "uuid";
import { Errors } from "./enums/errors";

export class User {
    private readonly uuid: string;
    private name: string;
    private age: number;
    private hobbies: string[];

    private static users: User[] = [];

    private constructor(name: string, age: number, hobbies: string[]) {
        this.uuid = uuid();
        this.name = name;
        this.age = age;
        this.hobbies = hobbies;
    }

    public static create(name: string, age: number, hobbies: string[]): User {
        const user = new User(name, age, hobbies);

        User.users.push(user);

        return user;
    }

    public static getUsers(): User[] {
        return User.users;
    }

    public static getUserByUUID(uuid: string): User {
        const index: number = User.findItemIndexByUUID(uuid);

        return User.users[index];
    }

    public static updateUser(uuid: string, name: string, age: number, hobbies: string[]): User {
        const index: number = User.findItemIndexByUUID(uuid);

        const updatingUser = User.users[index];

        updatingUser.name = name;
        updatingUser.age = age;
        updatingUser.hobbies = hobbies;

        User.users[index] = updatingUser;

        return updatingUser;
    }

    public static removeByUUID(uuid: string): void {
        const index: number = User.findItemIndexByUUID(uuid);

        User.users.splice(index, 1);
    }

    private static findItemIndexByUUID(uuid: string): number {
        if (!validateUUID(uuid)) {
            throw new Error(Errors.INVALID_UUID);
        }

        const index: number = User.users.findIndex((user => user.uuid === uuid));

        if (index === -1) {
            throw new Error(Errors.NOT_FOUND);
        }

        return index;
    }
}