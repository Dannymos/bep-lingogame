import { Language } from './Language.entity'
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Word {

    constructor(text: string, language: Language, id?: number) {
        this.id = id;
        this.text = text;
        this.language = language;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    text: string;

    @ManyToOne(type => Language, language => language.words)
    language: Language;
}