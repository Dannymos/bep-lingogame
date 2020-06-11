import { CharResult } from "./CharResult";
import { NewRoundInfo } from "./NewRoundInfo";
import { GameStatus } from "./GameStatus";
import { GuessResponseStatus } from "./GuessResponseStatus";

export class GuessResponse {

    constructor(status: GuessResponseStatus, guess: string, charResults: Array<CharResult>) {
        this._status = status;
        this._guess = guess;
        this._feedback = charResults;
        this._gameStatus = GameStatus.active;
    }

    private _status: GuessResponseStatus;

    private _newRoundInfo?: NewRoundInfo;

    private _guess: string;

    private _feedback: Array<CharResult>;

    private _gameStatus: GameStatus;

    get feedback(): Array<CharResult> {
        return this._feedback;
    }

    set feedback(value: Array<CharResult>) {
        this._feedback = value;
    }

    get newRoundInfo(): NewRoundInfo {
        return this._newRoundInfo;
    }

    set newRoundInfo(value: NewRoundInfo) {
        this._newRoundInfo = value;
    }
    get guess(): string {
        return this._guess;
    }

    set guess(value: string) {
        this._guess = value;
    }

    get gameStatus(): GameStatus {
        return this._gameStatus;
    }

    set gameStatus(value: GameStatus) {
        this._gameStatus = value;
    }

    get status(): GuessResponseStatus {
        return this._status;
    }

    set status(value: GuessResponseStatus) {
        this._status = value;
    }
}