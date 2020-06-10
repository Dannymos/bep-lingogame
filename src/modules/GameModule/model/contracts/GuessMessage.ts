import { IsAlpha, IsLowercase, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class GuessMessage {

    public clientId: string;

    @IsNotEmpty()
    @IsAlpha()
    @IsString()
    @IsLowercase()
    @MinLength(5)
    @MaxLength(7)
    public guess: string;

}