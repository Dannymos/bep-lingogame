import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordController } from "./controllers/WordController";
import { WordService } from "./services/WordService";
import { LanguageService } from "./services/LanguageService";
import { Language } from "./model/entities/Language.entity";
import { WordRepository } from "./persistence/WordRepository";
import { Word } from "./model/entities/Word.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ Word, WordRepository, Language ])
    ],
    controllers: [
        WordController
    ],
    providers: [
        WordService,
        LanguageService,
        Logger
    ],
    exports: [
        WordService
    ]
})

export class WordModule {}