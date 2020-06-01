import {
    Body,
    Controller, HttpException, HttpStatus,
    Post
} from '@nestjs/common';
import { WordDto } from "../model/dto/Word.dto";
import { WordService } from "../services/WordService";
import {Word} from "../model/entities/Word.entity";

@Controller()
export class WordController {
    constructor(private wordService: WordService) {}

    @Post('/word')
    async postWord(@Body() dto: WordDto): Promise<string> {
        const word = new Word(
            dto.text,
            dto.language
        );
        const result = await this.wordService.create(word);
        if(result.ok) {
            return JSON.stringify(result.data);
        }

        throw new HttpException({
                                status: HttpStatus.BAD_REQUEST,
                                error: result.message,
                            }, HttpStatus.BAD_REQUEST);
    }
}
