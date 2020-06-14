import { Test } from '@nestjs/testing';
import { TestingModule } from "@nestjs/testing";
import { Language } from "../../../src/modules/WordModule/model/entities/Language.entity";
import { Word } from "../../../src/modules/WordModule/model/entities/Word.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "../../../src/modules/DatabaseModule";
import { Logger, NotFoundException } from "@nestjs/common";
import { GameSessionManager } from "../../../src/modules/GameModule/services/GameSessionManager";
import { GameService } from "../../../src/modules/GameModule/services/GameService";
import { Game} from "../../../src/modules/GameModule/model/Game";
import { mockLogger } from "../../mocks/MockLogger";
import { WordService } from "../../../src/modules/WordModule/services/WordService";
import { LanguageService } from "../../../src/modules/WordModule/services/LanguageService";
import { NewRoundInfo } from "../../../src/modules/GameModule/model/contracts/NewRoundInfo";
import { GameSession } from "../../../src/modules/GameModule/model/GameSession";

describe('GameSessionManager', () => {
    let gameSessionManager: GameSessionManager;
    let gameService: GameService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                DatabaseModule,
                TypeOrmModule.forFeature([Word, Language])
            ],
            providers: [
                GameSessionManager,
                GameService,
                WordService,
                LanguageService,
                { provide: Logger, useClass: mockLogger}
            ]
        }).compile();

        gameSessionManager = module.get<GameSessionManager>(GameSessionManager);
        gameService = module.get<GameService>(GameService);
    });

    describe('initializeNewGameSession', () => {
        it('should return a a new game session',async () => {
            const mockClientId = "aclientid";
            const mockLanguage = new Language('TE', 'testlanguage');
            const mockWord = new Word('aaaaa', mockLanguage);
            const spy = jest.spyOn(gameService, 'initializeNewGame').mockImplementation(() => { return Promise.resolve(new Game(mockWord))});
            const expectedResult = new NewRoundInfo(5, "a", 1);

            const result = await gameSessionManager.initializeNewGameSession(mockClientId);

            expect(result).toStrictEqual(expectedResult);
            expect(spy).toHaveBeenCalled();
        });

        it('should return a a new game session',async () => {
            const mockClientId = "aclientid";
            const spy = jest.spyOn(gameService, 'initializeNewGame').mockImplementation(() => { throw new NotFoundException()});

            const result = await gameSessionManager.initializeNewGameSession(mockClientId);

            expect(result).toBeNull();
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('deleteGameSessionByClientId', () => {
        it('should delete an existing game session',async () => {
            const mockClientId = "aclientid";
            const mockLanguage = new Language('TE', 'testlanguage');
            const mockWord = new Word('aaaaa', mockLanguage);
            jest.spyOn(gameService, 'initializeNewGame').mockImplementation(() => { return Promise.resolve(new Game(mockWord))});
            const spy = jest.spyOn(gameSessionManager, 'deleteGameSessionByClientId');

            await gameSessionManager.initializeNewGameSession(mockClientId);
            gameSessionManager.deleteGameSessionByClientId(mockClientId);
            const result = gameSessionManager.getGameSessionByClientId(mockClientId);

            expect(result).toBeUndefined();
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('getGameSessionByClientId', () => {
        it('should return an existing game session',async () => {
            const mockClientId = "aclientid";
            const mockLanguage = new Language('TE', 'testlanguage');
            const mockWord = new Word('aaaaa', mockLanguage);
            jest.spyOn(gameService, 'initializeNewGame').mockImplementation(() => { return Promise.resolve(new Game(mockWord))});

            await gameSessionManager.initializeNewGameSession(mockClientId);
            const result = gameSessionManager.getGameSessionByClientId(mockClientId);

            expect(result).toBeInstanceOf(GameSession);
        });
    });
});
