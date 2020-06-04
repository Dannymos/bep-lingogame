import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Word} from "../model/entities/Word.entity";
import { IWord } from "../contracts/IWord";

@Injectable()
export class WordService {

    @InjectRepository(Word)
    private wordsRepository: Repository<Word>;

    async create(source: IWord): Promise<Word> {
        const word = this.wordsRepository.create({
            text: source.text,
            language: source.language
        });

        return await this.wordsRepository.save(word);
    }
}
