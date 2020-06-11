import {
    Controller,
    Get,
    Inject,
    NotFoundException
} from '@nestjs/common';
import { HighscoreService } from "../services/HighscoreService";
import { Highscore } from "../model/entities/Highscore.entity";

@Controller('highscore')
export class HighscoreController {

    @Inject(HighscoreService)
    private highscoreService: HighscoreService;

    @Get()
    public async getHighscores(): Promise<Array<Highscore>> {
        try {
            return await this.highscoreService.getAllHighscores();
        } catch(exception) {
            throw new NotFoundException(exception.message);
        }
    }
}
