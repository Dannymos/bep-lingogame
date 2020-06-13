export class NewRoundInfo {

    constructor(length: number, firstCharacter: string, roundNumber: number) {
        this._wordLength = length;
        this._firstCharacter = firstCharacter;
        this._roundNumber = roundNumber;
    }

    public _wordLength: number;

    public _firstCharacter: string;

    public _roundNumber: number;
}