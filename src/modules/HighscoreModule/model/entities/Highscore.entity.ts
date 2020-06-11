import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class Highscore {
    constructor(name: string, score: number) {
        this._name = name;
        this._score = score;
    }


    @PrimaryGeneratedColumn()
    private _id: number;

    @Column()
    private _name: string;

    @Column()
    private _score: number;

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }
    get score(): number {
        return this._score;
    }

    get id(): number {
        return this._id;
    }
}