import { WordService } from "../../../src/modules/WordModule/services/WordService";
import { Test } from '@nestjs/testing';
import { TestingModule } from "@nestjs/testing";
import { Language } from "../../../src/modules/WordModule/model/entities/Language.entity";
import { Word } from "../../../src/modules/WordModule/model/entities/Word.entity";
import { WordDto } from "../../../src/modules/WordModule/model/dto/Word.dto";
import { LanguageService } from "../../../src/modules/WordModule/services/LanguageService";
import { mockLanguageService } from "../../mocks/MockLanguageService";
import { WordRepository } from "../../../src/modules/WordModule/persistence/WordRepository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "../../../src/modules/DatabaseModule";

describe('WordService', () => {
    let wordService: WordService;
    let wordRepository: WordRepository;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                DatabaseModule,
                TypeOrmModule.forFeature([Word, Language])
            ],
            providers: [
                WordService,
                { provide: LanguageService, useClass: mockLanguageService }
            ]
        }).compile();

        wordService = module.get<WordService>(WordService);
        wordRepository = module.get<WordRepository>(WordRepository);
    });

    describe('createFromDto', () => {
        it('should create a new Word and return said Word"',async () => {

            const mockLanguage = new Language('TE', 'testlanguage');
            const mockWord = new WordDto('aword', mockLanguage.slug);

            wordRepository.createAndSave = jest.fn((text: string, language: Language) => {
                return Promise.resolve(new Word(text, language, 1));
            });

            const result = await wordService.createFromDto(mockWord);

            expect(result).toEqual({"id": 1, "language": {"id": 1, "name": "testlanguage", "slug": "TE"}, "text": "aword"});
        });

        it('should create a new Word from DTO and return said Word"',async () => {

            const mockLanguage = new Language('TE', 'testlanguage');
            const mockWordDto = new WordDto('aword', mockLanguage.slug);

            wordRepository.createAndSave = jest.fn((text: string, language: Language) => {
                return Promise.resolve(new Word(text, language, 1));
            });

            const result = await wordService.createFromDto(mockWordDto);

            expect(result).toEqual({"id": 1, "language": {"id": 1, "name": "testlanguage", "slug": "TE"}, "text": "aword"});
        });
    });

    describe('getRandomWord', () => {
        it('should return a valid word when only language is provided"',async () => {
            const mockLanguage = new Language('TE', 'testlanguage', 1);
            const mockWord = new Word('aword', mockLanguage, 1);
            wordRepository.findRandomWord = jest.fn(() => { return Promise.resolve(mockWord); });

            const result = await wordService.getRandomWord(mockLanguage.slug);

            expect(result).toBe(mockWord);
        });

        it('should return a valid word when language and length is provided"',async () => {
            const mockLanguage = new Language('TE', 'testlanguage', 1);
            const mockWord = new Word('aword', mockLanguage, 1);
            wordRepository.findRandomWord = jest.fn(() => { return Promise.resolve(mockWord); });

            const result = await wordService.getRandomWord(mockLanguage.slug, 6);

            expect(result).toBe(mockWord);
        });

        it('should return a valid word when language, length and list of excluded words is provided"',async () => {
            const mockLanguage = new Language('TE', 'testlanguage', 1);
            const mockWord = new Word('aword', mockLanguage, 1);
            const mockWordTwo = new Word('worda', mockLanguage, 2);
            const exclusionArray = new Array<Word>();
            exclusionArray.push(mockWordTwo);
            wordRepository.findRandomWord = jest.fn(() => { return Promise.resolve(mockWord); });

            const result = await wordService.getRandomWord(mockLanguage.slug, 6, exclusionArray);

            expect(result).toBe(mockWord);
        });
    });
});
