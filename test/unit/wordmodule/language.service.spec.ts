import { Test } from '@nestjs/testing';
import { getRepositoryToken } from "@nestjs/typeorm";
import { TestingModule } from "@nestjs/testing";
import { Language } from "../../../src/modules/WordModule/model/entities/Language.entity";
import { LanguageService } from "../../../src/modules/WordModule/services/LanguageService";
import { mockLanguageRepository } from "../../mocks/MockLanguageRepository";

describe('LanguageService', () => {

    let languageService: LanguageService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LanguageService,
                { provide: getRepositoryToken(Language), useClass: mockLanguageRepository },
            ]
        }).compile();

        languageService = module.get<LanguageService>(LanguageService);
    });

    describe('getLanguageBySlug', () => {
        it('should return a language that matches the provided slug', async () => {

            const mockLanguage = new Language('TE', 'testlanguage');

            const result = await languageService.getLanguageBySlug(mockLanguage.slug);

            expect(result).toBeInstanceOf(Language);
            expect(result.slug).toBe(mockLanguage.slug);
        });
    });
});
