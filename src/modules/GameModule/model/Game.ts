import { Word } from "../../WordModule/model/entities/Word.entity";
import { NewRoundInfo } from "./contracts/NewRoundInfo";

export class Game {

    constructor(word: Word) {
        this.currentWord = word;
        this.attempts = 0;
        this.previousWords = new Array<Word>();
        this.roundNumber = 1;
    }

    public currentWord: Word;

    public previousWords: Array<Word>;

    public attempts: number;

    public roundNumber: number;

    public startNewRound(word: Word): NewRoundInfo {
        this.previousWords.push(this.currentWord);
        this.currentWord = word;
        this.attempts = 0;
        this.roundNumber += 1;

        return new NewRoundInfo(word.text.length, word.getFirstCharacter(), this.roundNumber);
    }

    public getNextWordLength(): number {
        const length = this.currentWord.text.length;
        return length === 7 ? 5 : length + 1;
    }
}