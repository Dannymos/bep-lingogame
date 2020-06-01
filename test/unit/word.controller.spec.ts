import { Test, TestingModule } from '@nestjs/testing';
import { WordController } from "../../src/modules/WordModule/controllers/WordController";
import { WordService } from "../../src/modules/WordModule/services/WordService";
import { WordResult } from "../../src/modules/WordModule/contracts/WordResult";
import { WordDto } from "../../src/modules/WordModule/model/dto/Word.dto";
import { Word } from "../../src/modules/WordModule/model/entities/Word.entity";
import {Language} from "../../src/modules/WordModule/model/entities/Language.entity";
import {HttpException, HttpStatus} from "@nestjs/common";

describe('WordController', () => {
    let wordController: WordController;
    let wordService: WordService;

    beforeAll(async () => {
        wordService= new WordService();
        wordController = new WordController(wordService);
    });

    describe('create new Word', () => {
        it('should return newly created Word', async () => {
            const mockLanguage = new Language('TE', 'testlanguage');
            const mockWord = new Word('aword', mockLanguage);
            const mockResult = new WordResult(
                true,
                'Created new word',
                mockWord
            );

            jest.spyOn(wordService, 'create').mockImplementation(() => Promise.resolve(mockResult));

            const mockWordDto = new WordDto()
            const response = await wordController.postWord(mockWordDto);
            expect(response).toBe(JSON.stringify(mockWord));

        });

        it('should throw HttpException when service returns an error', async () => {
            const mockResult = new WordResult(
                false,
                'an error!',
                null
            );

            jest.spyOn(wordService, 'create').mockImplementation(() => Promise.resolve(mockResult));

            const mockWordDto = new WordDto();

            try {
                await wordController.postWord(mockWordDto);
            } catch(response) {
                expect(response).toBeInstanceOf(HttpException);
            }
        });
    });
});
