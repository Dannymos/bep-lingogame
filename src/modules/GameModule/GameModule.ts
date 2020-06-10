import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameGateway } from "./gateways/GameGateway";
import { GameSessionManager } from "./services/GameSessionManager";
import { GameService } from "./services/GameService";
import { WordModule } from "../WordModule/WordModule";

@Module({
    imports: [
        WordModule,
        TypeOrmModule.forFeature([])
    ],
    controllers: [

    ],
    providers: [
        GameSessionManager,
        GameGateway,
        GameService,
        Logger
    ],
})

export class GameModule {}