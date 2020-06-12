import { EntityRepository, Repository } from "typeorm";
import { Word } from "../model/entities/Word.entity";
import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import { Language } from "../model/entities/Language.entity";

@Injectable()
@EntityRepository(Word)
export class WordRepository extends Repository<Word> {

    public async findRandomWord(length: number, languageId: number, textToExclude?: Array<string>): Promise<Word> {
        const query = this.createQueryBuilder()
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

    public async createAndSave(text: string, language: Language): Promise<Word> {
        const word = this.create({
            text: text,
            language: language
        });
        return this.save(word);
    }

}