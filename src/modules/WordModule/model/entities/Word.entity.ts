import { Language } from './Language.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Word {

    constructor(text: string, language?: Language, id?: number) {
        this.id = id;
        this.text = text;
        this.language = language;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    text: string;

    @ManyToOne(() => Language, language => language.words)
    language: Language;

    public containsCharacter(char: string): boolean {
        return this.text.includes(char);
    }

    public containsCharacterInSamePosition(char: string, index: number): boolean {
        const characters = this.text.split('');

        return characters[index] === char;
    }

    public getFirstCharacter(): string {
        return this.text.charAt(0);
    }
}