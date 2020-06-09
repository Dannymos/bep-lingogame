import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Word } from "../model/entities/Word.entity";
import { IWord } from "../contracts/IWord";
import { LanguageService } from "./LanguageService";

@Injectable()
export class WordService {

    @Inject(LanguageService)
    private languageService: LanguageService;

    @InjectRepository(Word)
    private wordsRepository: Repository<Word>;

    public async create(source: IWord): Promise<Word> {
        const word = this.wordsRepository.create({
            text: source.text,
            language: source.language
        });

        return await this.wordsRepository.save(word);
    }

    public async getRandomWord(languageSlug: string,  length: number = 5, exclude: Array<Word> = new Array<Word>()): Promise<Word> {
        const textToExclude = exclude.map((word) => word.text);
        const language = await this.languageService.getLanguageBySlug(languageSlug);
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
