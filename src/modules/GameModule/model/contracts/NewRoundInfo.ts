export class NewRoundInfo {
    constructor(length: number, firstCharacter: string, roundNumber: number) {
        this.wordLength = length;
        this.firstCharacter = firstCharacter;
        this.roundNumber = roundNumber;
    }

    private wordLength: number;

    private firstCharacter: string;

    private roundNumber: number;
}