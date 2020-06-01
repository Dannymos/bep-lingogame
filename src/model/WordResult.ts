import {IResult} from "./interfaces/IResult";
import {Word} from "./entities/Word.entity";

export class WordResult implements IResult {
    ok: boolean;
    message: string;
    data: Word;

    constructor(ok: boolean, message: string, data: Word) {
        this.ok = ok;
        this.message = message;
        this.data = data;
    }
}