import { Logger, Module } from '@nestjs/common';
import { GameGateway } from "./gateways/GameGateway";
import { GameSessionManager } from "./services/GameSessionManager";
import { GameService } from "./services/GameService";
import { WordModule } from "../WordModule/WordModule";
import { HighscoreModule } from "../HighscoreModule/HighscoreModule";

@Module({
    imports: [
        WordModule,
        HighscoreModule
    ],
    providers: [
        GameSessionManager,
        GameGateway,
        GameService,
        Logger
    ],
})

export class GameModule {}