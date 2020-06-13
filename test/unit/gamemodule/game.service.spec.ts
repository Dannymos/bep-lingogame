import { Test } from '@nestjs/testing';
import { TestingModule } from "@nestjs/testing";
import { Language } from "../../../src/modules/WordModule/model/entities/Language.entity";
import { Word } from "../../../src/modules/WordModule/model/entities/Word.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "../../../src/modules/DatabaseModule";
import { Logger } from "@nestjs/common";
import { GameService } from "../../../src/modules/GameModule/services/GameService";
import { Game} from "../../../src/modules/GameModule/model/Game";
import { mockLogger } from "../../mocks/MockLogger";
import { WordService } from "../../../src/modules/WordModule/services/WordService";
import { LanguageService } from "../../../src/modules/WordModule/services/LanguageService";
import {GuessMessage} from "../../../src/modules/GameModule/model/contracts/GuessMessage";
import {GuessResponseStatus} from "../../../src/modules/GameModule/model/contracts/GuessResponseStatus";
import {CharResultStatus} from "../../../src/modules/GameModule/model/contracts/CharResultStatus";
import {NewRoundInfo} from "../../../src/modules/GameModule/model/contracts/NewRoundInfo";

describe('GameSessionManager', () => {
    let wordService: WordService;
    let gameService: GameService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                DatabaseModule,
                TypeOrmModule.forFeature([Word, Language])
            ],
            providers: [
                GameService,
                WordService,
                LanguageService,
                { provide: Logger, useClass: mockLogger}
            ]
        }).compile();

        wordService = module.get<WordService>(WordService);
        gameService = module.get<GameService>(GameService);
    });

    describe('initializeNewGame', () => {
        it('should return a new Game',async () => {
            const mockLanguage = new Language('TE', 'testlanguage');
            const mockWord = new Word('aaaaa', mockLanguage);
            const spy = jest.spyOn(wordService, 'getRandomWord').mockImplementation(() => { return Promise.resolve(mockWord)});
            const expectedResult = new Game(mockWord);

            const result = await gameService.initializeNewGame();

            expect(result).toStrictEqual(expectedResult);
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('handleGuess', () => {
        it('should return a GuessResponse that has the status "correct"',async () => {
            const mockLanguage = new Language('TE', 'testlanguage');
            const mockWord = new Word('aaaaa', mockLanguage);
            const mockGame = new Game(mockWord);
            const mockGuessMessage = new GuessMessage("aclientid", "aaaaa");

            const result = await gameService.handleGuess(mockGame, mockGuessMessage);

            expect(result.status).toBe(GuessResponseStatus.correct);
            result.feedback.forEach((charResult) => {
                expect(charResult.resultStatus).toBe(CharResultStatus.correct);
            });
        });

        it('should return a GuessResponse that has the status "incorrect"',async () => {
            const mockLanguage = new Language('TE', 'testlanguage');
            const mockWord = new Word('bbbbb', mockLanguage);
            const mockGame = new Game(mockWord);
            const mockGuessMessage = new GuessMessage("aclientid", "aaaaa");

            const result = await gameService.handleGuess(mockGame, mockGuessMessage);

            expect(result.status).toBe(GuessResponseStatus.incorrect);
            result.feedback.forEach((charResult) => {
                expect(charResult.resultStatus).toBe(CharResultStatus.absent);
            });
        });

        it('should start a new round',async () => {
            const mockLanguage = new Language('TE', 'testlanguage');
            const mockWord = new Word('aaaaa', mockLanguage);
            const mockWordTwo = new Word('bbbbbb', mockLanguage);
            const mockGame = new Game(mockWord);
            const mockGuessMessage = new GuessMessage("aclientid", "aaaaa");
            jest.spyOn(wordService, 'getRandomWord').mockImplementation(() => { return Promise.resolve(mockWordTwo) })
            const spy = jest.spyOn(mockGame, 'startNewRound');

            const result = await gameService.handleGuess(mockGame, mockGuessMessage);

            expect(result.status).toBe(GuessResponseStatus.correct);
            result.feedback.forEach((charResult) => {
                expect(charResult.resultStatus).toBe(CharResultStatus.correct);
            });
            expect(result.newRoundInfo).toBeInstanceOf(NewRoundInfo);
            expect(spy).toHaveBeenCalled();
        });
    });
});
