import { Word } from "../../src/modules/WordModule/model/entities/Word.entity";
import { Language } from "../../src/modules/WordModule/model/entities/Language.entity";
import { WordDto } from "../../src/modules/WordModule/model/dto/Word.dto";

export const mockWordRepository = jest.fn(() => ({
    metadata: {
        columns: [],
        relations: [],
    },
    save: jest.fn((word: Word) => {
        word.id = 1;
        return word;
    }),
    create: jest.fn((word: Word) => {
        return new Word(
            word.text,
            word.language
        );
    }),
    createQueryBuilder: jest.fn(() => ({
        where: jest.fn(()=> ({
            andWhere: jest.fn(() => ({
                getOne: jest.fn()
                    .mockImplementationOnce(() => {
                        const language = new Language('TE', 'testlanguage')
                        return new Word('aword', language)
                    })
            }))
        }))
    }))
}));