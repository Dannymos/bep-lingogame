import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Word } from "../model/entities/Word.entity";
import { LanguageService } from "./LanguageService";
import { WordDto } from "../model/dto/Word.dto";
import { WordRepository } from "../persistence/WordRepository";

@Injectable()
export class WordService {

    @Inject(LanguageService)
    private languageService: LanguageService;

    @InjectRepository(WordRepository)
    private wordsRepository: WordRepository;

    public async createFromDto(dto: WordDto): Promise<Word> {
        const language = await this.languageService.getLanguageBySlug(dto.language);
        return await this.wordsRepository.createAndSave(dto.text, language);
    }

    public async getRandomWord(languageSlug: string,  length = 5, exclude: Array<Word> = new Array<Word>()): Promise<Word> {
        const textToExclude = exclude.map((word) => word.text);
        const language = await this.languageService.getLanguageBySlug(languageSlug);
        const languageId = language.id;

        return this.wordsRepository.findRandomWord(length, languageId, textToExclude);
    }
}
