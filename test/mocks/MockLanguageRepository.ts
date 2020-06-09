import { Language } from "../../src/modules/WordModule/model/entities/Language.entity";


export const mockLanguageRepository = jest.fn(() => ({
    metadata: {
        columns: [],
        relations: [],
    },
    createQueryBuilder: jest.fn(() => ({
        where: jest.fn(()=> ({
            getOne: jest.fn()
                .mockImplementationOnce(() => {
                    return new Language('TE', 'TESTLANGUAGE')
                })
        }))
    }))
}));