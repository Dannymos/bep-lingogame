import {IsString, IsAlpha, IsNotEmpty, IsLowercase} from "class-validator";
import { Language } from "../entities/Language.entity";

export class WordDto {

    @IsAlpha()
    @IsString()
    @IsLowercase()
    text: string

    /*TODO:
    * ADD RULE THAT LANGUAGE MUST EXIST IN DB
     */ 
    @IsNotEmpty()
    language: Language;
}