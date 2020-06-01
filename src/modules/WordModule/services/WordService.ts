import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Word} from "../model/entities/Word.entity";
import { IWord } from "../contracts/IWord";
import { IResult } from "../contracts/IResult";
import {WordResult} from "../contracts/WordResult";

@Injectable()
export class WordService {

    @InjectRepository(Word)
    private wordsRepository: Repository<Word>;

    async create(source: IWord): Promise<IResult> {
        const word = this.wordsRepository.create({
            text: source.text,
            language: source.language
        });
        try {
            const newWord = await this.wordsRepository.save(word);
            return new WordResult(
                true,
                'Created new word',
                newWord
            );
        } catch (exception) {
            return new WordResult(
                false,
                exception,
                null
            );
        }
    }
}
