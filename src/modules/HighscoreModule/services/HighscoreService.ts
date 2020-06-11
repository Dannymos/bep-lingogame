import {Inject, Injectable, Logger, NotFoundException} from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Highscore } from "../model/entities/Highscore.entity";

@Injectable()
export class HighscoreService {

    @InjectRepository(Highscore)
    private highscoreRepository: Repository<Highscore>;

    @Inject(Logger)
    private logger: Logger;

    public async getAllHighscores(): Promise<Array<Highscore>> {
        const result = await this.highscoreRepository.find();
        if(result.length === 0) {
            throw new NotFoundException('No highscores found');
        }
        return result;
    }

    public async createHighscore(name: string, score: number): Promise<Highscore> {
        const highscore = new Highscore(name, score);
        try {
            return await this.highscoreRepository.save(highscore);
        } catch(exception) {
            this.logger.error(exception);
            return null;
        }

    }
}