import { Word } from "../../src/modules/WordModule/model/entities/Word.entity";
import { IWord } from "../../src/modules/WordModule/contracts/IWord";
import {Language} from "../../src/modules/WordModule/model/entities/Language.entity";
import {SelectQueryBuilder} from "typeorm";

export const mockWordRepository = jest.fn(() => ({
    metadata: {
        columns: [],
        relations: [],
    },
    save: jest.fn((word: Word) => {
        word.id = 1;
        return word;
    }),
    create: jest.fn((source: IWord) => {
        return new Word(
            source.text,
            source.language
        );
    }),
    createQueryBuilder: jest.fn(() => ({
        where: jest.fn(()=> ({
            andWhere: jest.fn(() => ({
                getOne: jest.fn()
                    .mockImplementationOnce(() => {
                        const language = new Language('TE', 'TESTLANGUAGE')
                        return new Word('aword', language)
                    })
            }))
        }))
    }))
}));