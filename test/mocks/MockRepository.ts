import { Word } from "../../src/modules/WordModule/model/entities/Word.entity";
import { IWord } from "../../src/modules/WordModule/contracts/IWord";

export const mockRepository = jest.fn(() => ({
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
    })
}));