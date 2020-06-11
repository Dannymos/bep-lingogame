import { Test } from "@nestjs/testing";
import { Logger, NotFoundException} from "@nestjs/common";
import { mockLogger } from "../../mocks/MockLogger";
import { HighscoreService } from "../../../src/modules/HighscoreModule/services/HighscoreService";
import { HighscoreController } from "../../../src/modules/HighscoreModule/controllers/HighscoreController";
import { Highscore } from "../../../src/modules/HighscoreModule/model/entities/Highscore.entity";
import { DatabaseModule } from "../../../src/modules/DatabaseModule";
import { getRepositoryToken} from "@nestjs/typeorm";
import { mockWordRepository } from "../../mocks/MockWordRepository";

describe('HighscoreController', () => {
    let highscoreController: HighscoreController
    let highscoreService: HighscoreService

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule],
            controllers: [HighscoreController],
            providers: [
                HighscoreService,
                { provide: Logger, useClass: mockLogger },
                { provide: getRepositoryToken(Highscore), useClass: mockWordRepository },
            ],
        }).compile();


        highscoreController = await module.resolve(HighscoreController);
        highscoreService = await module.resolve(HighscoreService);
    });

    describe('getHighscores', () => {
        it('should return highscores', async () => {
            const mockHighscore = new Highscore('test', 50);
            const mockResult = new Array<Highscore>();
            mockResult.push(mockHighscore);

            jest.spyOn(highscoreService, 'getAllHighscores').mockImplementation(() => Promise.resolve(mockResult));

            const result = await highscoreController.getHighscores();
            expect(result).toBe(mockResult);
        });
    });

    describe('getHighscores', () => {
        it('should throw NotFoundException', async () => {
            const mockHighscore = new Highscore('test', 50);
            const mockResult = new Array<Highscore>();
            mockResult.push(mockHighscore);

            jest.spyOn(highscoreService, 'getAllHighscores').mockImplementation(() => { throw new NotFoundException(); });

            try {
                await highscoreController.getHighscores();
            } catch(response) {
                expect(response).toBeInstanceOf(NotFoundException);
            }
        });
    });
});