import { Word } from "../../WordModule/model/entities/Word.entity";

export class Game {

    constructor(word: Word) {
        this.currentWord = word;
        this.attempts = 0;
    }

    public currentWord: Word;

    public previousWords: Array<Word>;

    public attempts: number;

    public newRound(word: Word) {
        this.previousWords.push(this.currentWord);
        this.currentWord = word;
        this.attempts = 0;
    }
}