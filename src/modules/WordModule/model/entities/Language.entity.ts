import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Word } from "./Word.entity";

@Entity()
export class Language {

    constructor(slug: string, name: string, id?: number) {
        this.id = id;
        this.slug = slug;
        this.name = name;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    slug: string;

    @Column({ unique: true})
    name: string;

    @OneToMany(() => Word, word => word.language)
    words: Word[]
}