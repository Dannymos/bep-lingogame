import { Test, TestingModule } from '@nestjs/testing';
import { Word } from "../../../src/modules/WordModule/model/entities/Word.entity";
import { Logger } from "@nestjs/common";
import { GameService } from "../../../src/modules/GameModule/services/GameService";
import { Game } from "../../../src/modules/GameModule/model/Game";
import { mockLogger } from "../../mocks/MockLogger";
import { GuessMessage } from "../../../src/modules/GameModule/model/contracts/GuessMessage";
import { GuessResponseStatus } from "../../../src/modules/GameModule/model/contracts/GuessResponseStatus";
import { GameSessionManager } from "../../../src/modules/GameModule/services/GameSessionManager";
import { GameGateway } from "../../../src/modules/GameModule/gateways/GameGateway";
import { GameSession } from "../../../src/modules/GameModule/model/GameSession";
import { GuessResponse } from "../../../src/modules/GameModule/model/contracts/GuessResponse";
import { GameStatus } from "../../../src/modules/GameModule/model/contracts/GameStatus";
import { HighscoreService } from "../../../src/modules/HighscoreModule/services/HighscoreService";
import { WordService } from "../../../src/modules/WordModule/services/WordService";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Highscore } from "../../../src/modules/HighscoreModule/model/entities/Highscore.entity";
import { mockRepository } from "../../mocks/MockRepository";
import { Language } from "../../../src/modules/WordModule/model/entities/Language.entity";
import { LanguageService } from "../../../src/modules/WordModule/services/LanguageService";
import { HighscoreMessage } from "../../../src/modules/GameModule/model/contracts/HighscoreMessage";

describe('GameSessionManager', () => {
    let gameSessionManager: GameSessionManager;
    let gameService: GameService;
    let highscoreService: HighscoreService;
    let gameGateway: GameGateway;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                GameGateway,
                GameSessionManager,
                GameService,
                HighscoreService,
                WordService,
                LanguageService,
                { provide: Logger, useClass: mockLogger},
                { provide: getRepositoryToken(Highscore), useClass: mockRepository },
                { provide: getRepositoryToken(Word), useClass: mockRepository },
                { provide: getRepositoryToken(Language), useClass: mockRepository }
            ]
        }).compile();

        highscoreService = module.get<HighscoreService>(HighscoreService);
        gameService = module.get<GameService>(GameService);
        gameSessionManager = module.get<GameSessionManager>(GameSessionManager);
        gameGateway = module.get<GameGateway>(GameGateway);
    });

    describe('handleGuess', () => {
        it('should return a correct GuessResponse',async () => {
            const mockGuess = new GuessMessage('aclientid', 'aguess');
            const mockWord = new Word('aword');
            const mockGame = new Game(mockWord);
            const mockGameSession = new GameSession(mockGuess.clientId, mockGame);
            const expectedResult = new GuessResponse(GuessResponseStatus.correct, mockGuess.guess, null)

            jest.spyOn(gameSessionManager, 'getGameSessionByClientId').mockImplementation(() => { return mockGameSession });
            jest.spyOn(gameService, 'handleGuess').mockImplementation(() => {
                return Promise.resolve(expectedResult);
            });

            const result = await gameGateway.handleGuess(mockGuess);

            expect(result).toStrictEqual(expectedResult);
        });

        it('should return error response when game is not found',async () => {
            const mockGuess = new GuessMessage('aclientid', 'aguess');
            const expectedResult =  new GuessResponse(GuessResponseStatus.error, mockGuess.guess, null);

            jest.spyOn(gameSessionManager, 'getGameSessionByClientId').mockImplementation(() => { return null });

            const result = await gameGateway.handleGuess(mockGuess);

            expect(result).toStrictEqual(expectedResult);
        });

        it('should return error response when guess is done after game is over',async () => {
            const mockGuess = new GuessMessage('aclientid', 'aguess');
            const mockWord = new Word('aword');
            const mockGame = new Game(mockWord);
            mockGame.status = GameStatus.gameOver;
            const mockGameSession = new GameSession(mockGuess.clientId, mockGame);
            const expectedResult =  new GuessResponse(GuessResponseStatus.error, mockGuess.guess, null);

            jest.spyOn(gameSessionManager, 'getGameSessionByClientId').mockImplementation(() => { return mockGameSession });

            const result = await gameGateway.handleGuess(mockGuess);

            expect(result).toStrictEqual(expectedResult);
        });
    });

    describe('submitHighscore', () => {
        it('should return true after succesfully saving highscore',async () => {
            const mockSubmission = new HighscoreMessage('aclientid', 'Test');
            const mockWord = new Word('aword');
            const mockGame = new Game(mockWord);
            mockGame.status = GameStatus.gameOver;
            const mockGameSession = new GameSession(mockSubmission.clientId, mockGame);
            const mockHighscore = new Highscore(mockSubmission.name, 100);

            jest.spyOn(gameSessionManager, 'getGameSessionByClientId').mockImplementation(() => { return mockGameSession });
            jest.spyOn(highscoreService, 'createHighscore').mockImplementation(() => {
                return Promise.resolve(mockHighscore);
            });

            const result = await gameGateway.submitHighscore(mockSubmission);

            expect(result).toStrictEqual(true);
        });

        it('should return false if highscore is submitted and game is not over',async () => {
            const mockSubmission = new HighscoreMessage('aclientid', 'Test');
            const mockWord = new Word('aword');
            const mockGame = new Game(mockWord);
            mockGame.status = GameStatus.active;
            const mockGameSession = new GameSession(mockSubmission.clientId, mockGame);
            const mockHighscore = new Highscore(mockSubmission.name, 100);

            jest.spyOn(gameSessionManager, 'getGameSessionByClientId').mockImplementation(() => { return mockGameSession });
            jest.spyOn(highscoreService, 'createHighscore').mockImplementation(() => {
                return Promise.resolve(mockHighscore);
            });

            const result = await gameGateway.submitHighscore(mockSubmission);

            expect(result).toStrictEqual(false);
        });

        it('should return false if no game is found',async () => {
            const mockSubmission = new HighscoreMessage('aclientid', 'Test');

            jest.spyOn(gameSessionManager, 'getGameSessionByClientId').mockImplementation(() => { return null });

            const result = await gameGateway.submitHighscore(mockSubmission);

            expect(result).toStrictEqual(false);
        });
    });
});
