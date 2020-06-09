import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Language } from "../model/entities/Language.entity";

@Injectable()
export class LanguageService {

    @InjectRepository(Language)
    private languageRepository: Repository<Language>;

    public async getLanguageBySlug(slug: string): Promise<Language> {
        const result = await this.languageRepository.createQueryBuilder().where("language.slug = :slug", { slug }).getOne();

        if(result == null) {
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'No Language found!'
            }, HttpStatus.NOT_FOUND);
        }

        return result;
    }
}
