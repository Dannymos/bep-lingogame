import { WordService } from "../../src/modules/WordModule/services/WordService";
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from "@nestjs/typeorm";
import { TestingModule } from "@nestjs/testing";
import { Language } from "../../src/modules/WordModule/model/entities/Language.entity";
import { Word } from "../../src/modules/WordModule/model/entities/Word.entity";
import { WordDto } from "../../src/modules/WordModule/model/dto/Word.dto";
import { mockWordRepository } from "../mocks/MockWordRepository";

describe('WordService', () => {
    let wordService: WordService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WordService,
                { provide: getRepositoryToken(Word), useClass: mockWordRepository },
            ]
        }).compile();

        wordService = module.get<WordService>(WordService);
    });

    describe('create', () => {
        it('should create a new Word and return said Word"',async () => {

            const mockLanguage = new Language('TE', 'testlanguage');
            const mockWord = new Word('aword', mockLanguage);

            const result = await wordService.create(mockWord);

            expect(result).toBeInstanceOf(Word);
        });

        it('should create a new Word from DTO and return said Word"',async () => {

            const mockLanguage = new Language('TE', 'testlanguage');
            const mockWordDto = new WordDto('aword', mockLanguage);

            const result = await wordService.create(mockWordDto);

            expect(result).toBeInstanceOf(Word);
        });
    });

    describe('getWord', () => {
        it('should return a 5 letter word when no length or exclusion is provided"',async () => {

            const mockLanguage = new Language('TE', 'testlanguage');
            const exclude = new Array<Word>();
            const result = await wordService.getWord(mockLanguage, exclude);

            expect(result).toBeInstanceOf(Word);
            expect(result.language).toBe(mockLanguage);
            expect(result.text.length).toBe(5);
        });
    });
});
