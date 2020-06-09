import { Language } from "../../src/modules/WordModule/model/entities/Language.entity";

export const mockLanguageService = jest.fn(() => ({
    getLanguageBySlug: (slug: string) => {
        const mockLanguage = new Language(slug, "testlanguage", 1);
        return Promise.resolve(mockLanguage);
    }
}));