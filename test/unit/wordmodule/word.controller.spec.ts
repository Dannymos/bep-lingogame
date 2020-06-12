import { Test } from '@nestjs/testing';
import { WordController } from "../../../src/modules/WordModule/controllers/WordController";
import { WordService } from "../../../src/modules/WordModule/services/WordService";
import { WordDto } from "../../../src/modules/WordModule/model/dto/Word.dto";
import { Word } from "../../../src/modules/WordModule/model/entities/Word.entity";
import { Language } from "../../../src/modules/WordModule/model/entities/Language.entity";
import { HttpException, HttpStatus, Logger } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { mockRepository } from "../../mocks/MockRepository";
import { mockLogger } from '../../mocks/MockLogger';
import { mockLanguageService } from "../../mocks/MockLanguageService";
import { LanguageService } from "../../../src/modules/WordModule/services/LanguageService";

describe('WordController', () => {
    let wordController: WordController;
    let wordService: WordService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            controllers: [WordController],
            providers: [
                WordService,
                { provide: LanguageService, useClass: mockLanguageService },
                { provide: getRepositoryToken(Word), useClass: mockRepository },
                { provide: Logger, useClass: mockLogger }
            ],
        }).compile();


        wordController = await module.resolve(WordController);
        wordService = await module.resolve(WordService);
    });

    describe('create new Word', () => {
        it('should return newly created Word', async () => {
            const mockLanguage = new Language('TE', 'testlanguage');
            const mockWord = new Word('aword', mockLanguage);
            const mockWordDto = new WordDto('aword', mockLanguage.slug);

            jest.spyOn(wordService, 'createFromDto').mockImplementation(() => Promise.resolve(mockWord));


            const response = await wordController.create(mockWordDto);
            expect(response).toBe(JSON.stringify(mockWord));
        });

        it('should throw HttpException when service returns an error', async () => {
            const mockLanguage = new Language('TE', 'testlanguage');
            const mockWordDto = new WordDto('aword', mockLanguage.slug);

            jest.spyOn(wordService, 'createFromDto').mockImplementation(() => {
                throw new HttpException({}, HttpStatus.BAD_REQUEST);
            });

            try {
                await wordController.create(mockWordDto);
            } catch(response) {
                expect(response).toBeInstanceOf(HttpException);
            }
        });
    });
});
