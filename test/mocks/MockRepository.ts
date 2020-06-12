import { Word } from "../../src/modules/WordModule/model/entities/Word.entity";

export const mockRepository = jest.fn(() => ({
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
    })
}));