import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Word } from "../model/entities/Word.entity";
import { IWord } from "../contracts/IWord";
import { Language } from "../model/entities/Language.entity";

@Injectable()
export class WordService {

    @InjectRepository(Word)
    private wordsRepository: Repository<Word>;

    public async create(source: IWord): Promise<Word> {
        const word = this.wordsRepository.create({
            text: source.text,
            language: source.language
        });

        return await this.wordsRepository.save(word);
    }

    public async getWord(language: Language, exclude?: Array<Word>, length: number = 5): Promise<Word> {
        const textToExclude = exclude.map((word) => word.text);
        const languageId = language.id;

        const result = await this.wordsRepository.createQueryBuilder()
            .select("word")
            .from(Word, "word")
            .where("word.text != IN (:...textToExclude)", { textToExclude })
            .andWhere("CHAR_LENGTH(word.text) = :length", { length })
            .andWhere("languageId = :languageId", { languageId })
            .getOne();

        return new Word(result.text, language);
    }
}
