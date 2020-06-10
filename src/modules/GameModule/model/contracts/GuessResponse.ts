import { CharResult } from "./CharResult";

export class GuessResponse {

    constructor(correct: boolean, guess: string, charResults: Array<CharResult>) {
        this.correct = correct;
        this.guess = guess;
        this.feedback = charResults;
    }

    public correct: boolean;

    private guess: string;

    private feedback: Array<CharResult>;

    private newWordLength?: number;
}