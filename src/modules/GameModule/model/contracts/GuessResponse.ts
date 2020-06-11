import { CharResult } from "./CharResult";
import { NewRoundInfo } from "./NewRoundInfo";

export class GuessResponse {

    constructor(correct: boolean, guess: string, charResults: Array<CharResult>) {
        this.correct = correct;
        this.guess = guess;
        this.feedback = charResults;
    }

    public correct: boolean;

    public newRoundInfo?: NewRoundInfo;

    private guess: string;

    private feedback: Array<CharResult>;
}