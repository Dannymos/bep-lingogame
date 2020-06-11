import { CharResultStatus } from "./CharResultStatus";

export class CharResult {

    constructor(char: string, result: CharResultStatus) {
        this.char = char;
        this.resultStatus = result;
    }

    public char: string;

    public resultStatus: CharResultStatus;
}