import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from "./model/entities/Word.entity";
import { WordController } from "./controllers/WordController";
import { WordService } from "./services/WordService";
import { LanguageService } from "./services/LanguageService";
import { Language } from "./model/entities/Language.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ Word, Language ])
    ],
    controllers: [
        WordController
    ],
    providers: [
        WordService,
        LanguageService,
        Logger
    ],
})

export class WordModule {}