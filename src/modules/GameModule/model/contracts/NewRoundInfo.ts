export class NewRoundInfo {

    constructor(length: number, firstCharacter: string, roundNumber: number) {
        this._wordLength = length;
        this._firstCharacter = firstCharacter;
        this._roundNumber = roundNumber;
    }

    private _wordLength: number;

    private _firstCharacter: string;

    private _roundNumber: number;

    get roundNumber(): number {
        return this._roundNumber;
    }

    set roundNumber(value: number) {
        this._roundNumber = value;
    }
    get firstCharacter(): string {
        return this._firstCharacter;
    }

    set firstCharacter(value: string) {
        this._firstCharacter = value;
    }
    get wordLength(): number {
        return this._wordLength;
    }

    set wordLength(value: number) {
        this._wordLength = value;
    }
}