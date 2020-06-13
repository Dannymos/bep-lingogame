import { IsAlpha,  IsNotEmpty, IsString } from "class-validator";

export class HighscoreMessage {
    constructor(clientId: string, name: string) {
        this.clientId = clientId;
        this.name = name;
    }


    private _clientId: string;

    @IsNotEmpty()
    @IsAlpha()
    @IsString()
    private _name: string;

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get clientId(): string {
        return this._clientId;
    }

    set clientId(value: string) {
        this._clientId = value;
    }
}