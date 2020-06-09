import {HttpException, HttpStatus, Inject, Injectable, Logger} from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Word } from "../model/entities/Word.entity";
import { IWord } from "../contracts/IWord";
import { Language } from "../model/entities/Language.entity";

@Injectable()
export class WordService {

    @Inject(Logger)
    private logger: Logger;

    @InjectRepository(Word)
    private wordsRepository: Repository<Word>;

    public async create(source: IWord): Promise<Word> {
        const word = this.wordsRepository.create({
            text: source.text,
            language: source.language
        });

        return await this.wordsRepository.save(word);
    }

    public async getWord(language: Language,  length: number = 5, exclude: Array<Word> = new Array<Word>()): Promise<Word> {
        const textToExclude = exclude.map((word) => word.text);
        const languageId = language.id;
        const query = await this.wordsRepository.createQueryBuilder()
            .where("CHAR_LENGTH(word.text) = :length", { length })
            .andWhere("word.languageId = :languageId", { languageId });
        if(textToExclude.length > 0) {
            query.andWhere("word.text NOT IN (:...textToExclude)", { textToExclude });
        }

        const result = await query.getOne();

        if(result == null) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'No word found!'
            }, HttpStatus.NOT_FOUND);
        }

        return result;
    }
}
