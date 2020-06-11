import { Word } from "../../WordModule/model/entities/Word.entity";
import { NewRoundInfo } from "./contracts/NewRoundInfo";
import {GameStatus} from "./contracts/GameStatus";

export class Game {

    constructor(word: Word) {
        this._currentWord = word;
        this._attempts = 4;
        this._previousWords = new Array<Word>();
        this._roundNumber = 1;
        this._status = GameStatus.active;
        this._score = 500;
    }

    private _status: GameStatus;

    private _currentWord: Word;

    private _previousWords: Array<Word>;

    private _attempts: number;

    private _roundNumber: number;

    private _score: number;

    get score(): number {
        return this._score;
    }

    set score(value: number) {
        this._score = value;
    }
    get roundNumber(): number {
        return this._roundNumber;
    }

    set roundNumber(value: number) {
        this._roundNumber = value;
    }
    get attempts(): number {
        return this._attempts;
    }

    set attempts(value: number) {
        this._attempts = value;
    }
    get previousWords(): Array<Word> {
        return this._previousWords;
    }

    set previousWords(value: Array<Word>) {
        this._previousWords = value;
    }
    get currentWord(): Word {
        return this._currentWord;
    }

    set currentWord(value: Word) {
        this._currentWord = value;
    }
    get status(): GameStatus {
        return this._status;
    }

    set status(value: GameStatus) {
        this._status = value;
    }

    public startNewRound(word: Word): NewRoundInfo {
        this._score = this.updateScore();
        this._previousWords.push(this._currentWord);
        this._currentWord = word;
        this._attempts = 0;
        this._roundNumber += 1;

        return new NewRoundInfo(word.text.length, word.getFirstCharacter(), this._roundNumber);
    }

    public getNextWordLength(): number {
        const length = this._currentWord.text.length;
        return length === 7 ? 5 : length + 1;
    }

    private updateScore(): number {
        return this._score + (60 - (10 * this._attempts));
    }

    public incrementAttempts(): void {
        this.attempts += 1;
        if(this.attempts === 5) {

        }
    }
}