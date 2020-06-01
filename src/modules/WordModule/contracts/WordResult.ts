import {IResult} from "./IResult";
import {Word} from "../model/entities/Word.entity";

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