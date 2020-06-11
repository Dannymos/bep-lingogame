import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Highscore } from "./model/entities/Highscore.entity";
import { HighscoreController } from "./controllers/HighscoreController";
import { HighscoreService } from "./services/HighscoreService";

@Module({
    imports: [
        TypeOrmModule.forFeature([ Highscore ])
    ],
    controllers: [
        HighscoreController
    ],
    providers: [
        HighscoreService,
        Logger
    ],
    exports: [
        HighscoreService
    ]
})
export class HighscoreModule {}