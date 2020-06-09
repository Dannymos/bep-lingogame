import {IsString, IsAlpha, IsNotEmpty, IsLowercase, MinLength, MaxLength, IsUppercase} from "class-validator";

export class WordDto {

    constructor(text: string, language: string) {
        this.text = text;
        this.language = language;
    }

    @IsNotEmpty()
    @IsAlpha()
    @IsString()
    @IsLowercase()
    @MinLength(5)
    @MaxLength(7)
    text: string

    @IsNotEmpty()
    @IsAlpha()
    @IsString()
    @IsUppercase()
    @MinLength(2)
    @MaxLength(2)
    language: string;
}