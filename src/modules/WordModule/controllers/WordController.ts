import {
    Body,
    Controller, HttpException, HttpStatus,
    Inject, Logger,
    Post
} from '@nestjs/common';
import { WordDto } from "../model/dto/Word.dto";
import { WordService } from "../services/WordService";
import { Word } from "../model/entities/Word.entity";

@Controller('word')
export class WordController {

    @Inject(Logger)
    private logger: Logger;

    @Inject(WordService)
    private wordService: WordService

    @Post()
    async create(@Body() dto: WordDto): Promise<string> {
        const word = new Word(
            dto.text,
            dto.language
        );
        try {
            const result = await this.wordService.create(word);
            return JSON.stringify(result);
        } catch(exception) {
            this.logger.error(exception);
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Something went wrong when creating a new word, try again later!'
            }, HttpStatus.BAD_REQUEST);
        }
    }
}
