import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Word} from "../model/entities/Word.entity";
import { IWord } from "../model/interfaces/IWord";
import { IResult } from "../model/interfaces/IResult";
import {WordResult} from "../model/WordResult";

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
