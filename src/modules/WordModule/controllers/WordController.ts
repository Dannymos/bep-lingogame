import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Inject,
    Logger, NotFoundException,
    Post
} from '@nestjs/common';
import { WordDto } from "../model/dto/Word.dto";
import { WordService } from "../services/WordService";

@Controller('word')
export class WordController {

    @Inject(Logger)
    private logger: Logger;

    @Inject(WordService)
    private wordService: WordService;

    @Post()
    public async create(@Body() dto: WordDto): Promise<string> {
        try {
            const result = await this.wordService.createFromDto(dto);
            return JSON.stringify(result);
        } catch(exception) {
            this.logger.error(exception);
            if(exception.status === 404){
                throw new NotFoundException(exception.response.error);
            } else {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: exception.error
                }, HttpStatus.BAD_REQUEST);
            }

        }
    }
}
