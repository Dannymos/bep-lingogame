import { Test } from "@nestjs/testing";
import { Logger } from "@nestjs/common";
import { mockLogger } from "../../mocks/MockLogger";
import { HighscoreService } from "../../../src/modules/HighscoreModule/services/HighscoreService";
import { HighscoreController } from "../../../src/modules/HighscoreModule/controllers/HighscoreController";
import { Highscore } from "../../../src/modules/HighscoreModule/model/entities/Highscore.entity";
import { DatabaseModule } from "../../../src/modules/DatabaseModule";
import { getRepositoryToken} from "@nestjs/typeorm";
import { mockRepository } from "../../mocks/MockRepository";

describe('HighscoreService', () => {
    let highscoreController: HighscoreController
    let highscoreService: HighscoreService

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule],
            controllers: [HighscoreController],
            providers: [
                HighscoreService,
                { provide: Logger, useClass: mockLogger },
                { provide: getRepositoryToken(Highscore), useClass: mockRepository },
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
});
