import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestUtilities } from "./utilities/test.utilities";
import { AppModule } from "../../src/modules/AppModule";

describe('WordModule (e2e)', () => {
    let app: INestApplication;
    let testingUtilities: TestUtilities;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [
                AppModule
            ],
            providers: [
                TestUtilities
            ]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        testingUtilities = app.get<TestUtilities>(TestUtilities);
    });

    beforeEach(async () => {
        await testingUtilities.loadFixtures();
    });

    it('submit new word to /word should return 2xx (POST)', () => {
        const mockRequest = {
            text: "testt",
            language: "TE"
        }

        return request(app.getHttpServer())
            .post('/word')
            .send(mockRequest)
            .expect(201)
            .expect('{"id":7,"text":"testt","language":{"id":1,"slug":"TE","name":"testlanguage"}}');
    });

    it('submit new word to /word should return 4xx when invalid language is provided (POST)', () => {
        const mockRequest = {
            text: "testt",
            language: "NLAS!a"
        }

        return request(app.getHttpServer())
            .post('/word')
            .send(mockRequest)
            .expect(400)
            .expect('{"statusCode":400,"message":["language must be shorter than or equal to 2 characters","language must be uppercase","language must contain only letters (a-zA-Z)"],"error":"Bad Request"}');
    });

    it('submit new word to /word should return 4xx when provided language does not exist (POST)', () => {
        const mockRequest = {
            text: "testt",
            language: "EN"
        }

        return request(app.getHttpServer())
            .post('/word')
            .send(mockRequest)
            .expect(404)
            .expect('{"statusCode":404,"message":"No Language found!","error":"Not Found"}');
    });

    it('submit new INVALID word to /word should return 4xx (POST)', () => {
        const mockRequest = {
            text: "'aSSSword23!",
            language: "TE"
        }

        return request(app.getHttpServer())
            .post('/word')
            .send(mockRequest)
            .expect(400)
            .expect('{"statusCode":400,"message":["text must be shorter than or equal to 7 characters","text must be a lowercase string","text must contain only letters (a-zA-Z)"],"error":"Bad Request"}');
    });
});
