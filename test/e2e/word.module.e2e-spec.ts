import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import { WordModule } from "../../src/modules/WordModule/WordModule";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Word } from "../../src/modules/WordModule/model/entities/Word.entity";
import { Language } from "../../src/modules/WordModule/model/entities/Language.entity";
import { WordDto } from "../../src/modules/WordModule/model/dto/Word.dto";

describe('Word Module (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const mockWordRepo = {
            save: (word: Word) => {
                word.id = 1;
                return word;
            },
            create: (dto: WordDto) => {
                const language = new Language(dto.language, 'testlanguage');
                return new Word(dto.text, language);
            }
        }

        const mockLanguageRepo = {
            createQueryBuilder: jest.fn(() => ({
                where: jest.fn(()=> ({
                    getOne: jest.fn()
                        .mockImplementation(() => {
                            return new Language('TE', "testlanguage");
                        })
                }))
            }))
        }

        const moduleFixture = await Test.createTestingModule({
            imports: [WordModule],
        }).overrideProvider(getRepositoryToken(Word))
            .useValue(mockWordRepo)
            .overrideProvider(getRepositoryToken(Language))
            .useValue(mockLanguageRepo)
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    it('submit new word to /word should return 2xx (POST)', () => {
        const mockRequest = {
            text: "aword",
            language: "TE"
        }

        return request(app.getHttpServer())
            .post('/word')
            .send(mockRequest)
            .expect(201)
            .expect('{"id":1,"text":"aword","language":{"slug":{"slug":"TE","name":"testlanguage"},"name":"testlanguage"}}');
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
