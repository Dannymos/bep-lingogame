import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HighscoreService } from "../../src/modules/HighscoreModule/services/HighscoreService";
import { Highscore } from "../../src/modules/HighscoreModule/model/entities/Highscore.entity";
import { AppModule } from "../../src/modules/AppModule";

describe('HighscoreModule (e2e)', () => {

    let app: INestApplication;

    let mockHighscore: Highscore;

    let highscoreService: HighscoreService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                AppModule
            ],
        }).compile();

        highscoreService = module.get<HighscoreService>(HighscoreService);
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
        mockHighscore = new Highscore('test', 50)
    });

    it('should return 404 when no results are found (GET)', () => {

        return request(app.getHttpServer())
            .get('/highscore')
            .expect(404)
            .expect('{"statusCode":404,"message":"No highscores found","error":"Not Found"}');
    });

    it('should return all highscores in db (GET)', async () => {
        await highscoreService.createHighscore(mockHighscore.name, mockHighscore.score);
        return request(app.getHttpServer())
            .get('/highscore')
            .expect(200)
            .expect('[{"_name":"test","_score":50,"_id":1}]');
    });
});
