import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from "../model/entities/Word.entity";
import {WordRegistrationController} from "../controllers/WordRegistrationController";
import {WordService} from "../services/WordService";

@Module({
    imports: [
        TypeOrmModule.forFeature([Word])
    ],
    controllers: [
        WordRegistrationController
    ],
    providers: [
        WordService
    ],
})

export class WordRegistrationModule {}