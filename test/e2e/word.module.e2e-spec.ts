import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import { WordModule } from "../../src/modules/WordModule/WordModule";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Word } from "../../src/modules/WordModule/model/entities/Word.entity";
import { Language } from "../../src/modules/WordModule/model/entities/Language.entity";
import {IWord} from "../../src/modules/WordModule/contracts/IWord";

describe('Word Module (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const mockRepo = {
            save: (word: Word) => {
                word.id = 1;
                return word;
            },
            create: (source: IWord) => {
                return new Word(source.text, source.language);
            }
        }

        const moduleFixture = await Test.createTestingModule({
            imports: [WordModule],
        }).overrideProvider(getRepositoryToken(Word))
            .useValue(mockRepo)
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    it('submit new word to /word should return 2xx (POST)', () => {
        const mockLanguage = new Language('TE', 'testlanguage');
        const mockWord = new Word('aword', mockLanguage);

        return request(app.getHttpServer())
            .post('/word')
            .send(mockWord)
            .expect(201)
            .expect('{"id":1,"text":"aword","language":{"slug":"TE","name":"testlanguage"}}');
    });

    it('submit new INVALID word to /word should return 4xx (POST)', () => {
        const mockLanguage = new Language('TE', 'testlanguage');
        const mockWord = new Word('aSSSword23!', mockLanguage);

        return request(app.getHttpServer())
            .post('/word')
            .send(mockWord)
            .expect(400)
            .expect('{"statusCode":400,"message":["text must be a lowercase string","text must contain only letters (a-zA-Z)"],"error":"Bad Request"}');
    });
});
