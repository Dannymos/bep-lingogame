import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from "./model/entities/Word.entity";
import { WordController } from "./controllers/WordController";
import { WordService } from "./services/WordService";

@Module({
    imports: [
        TypeOrmModule.forFeature([ Word ])
    ],
    controllers: [
        WordController
    ],
    providers: [
        WordService,
        Logger
    ],
})

export class WordModule {}