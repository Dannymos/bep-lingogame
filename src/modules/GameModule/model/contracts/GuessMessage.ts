import { IsAlpha, IsLowercase, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class GuessMessage {
    constructor(clientId: string, guess: string) {
        this.clientId = clientId;
        this.guess = guess;
    }


    private _clientId: string;

    @IsNotEmpty()
    @IsAlpha()
    @IsString()
    @IsLowercase()
    @MinLength(5)
    @MaxLength(7)
    private _guess: string;

    get guess(): string {
        return this._guess;
    }

    set guess(value: string) {
        this._guess = value;
    }

    get clientId(): string {
        return this._clientId;
    }

    set clientId(value: string) {
        this._clientId = value;
    }
}