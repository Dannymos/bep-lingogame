import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameGateway } from "./gateways/GameGateway";
import {GameSessionManager} from "./services/GameSessionManager";

@Module({
    imports: [
        TypeOrmModule.forFeature([ ])
    ],
    controllers: [

    ],
    providers: [
        GameSessionManager,
        GameGateway,
        Logger
    ],
})

export class GameModule {}