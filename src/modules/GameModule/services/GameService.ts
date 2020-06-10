import { Game } from "../model/Game";
import { GuessMessage } from "../model/contracts/GuessMessage";
import { WordService } from "../../WordModule/services/WordService";
import { Inject, Logger } from "@nestjs/common";
import { CharResult } from "../model/contracts/CharResult";
import { Word } from "../../WordModule/model/entities/Word.entity";
import { GuessResponse } from "../model/contracts/GuessResponse";
import { CharResultStatus } from "../model/contracts/CharResultStatus";

export class GameService {

    @Inject(Logger)
    private logger: Logger;

    @Inject(WordService)
    private wordService: WordService;

    public async initializeNewGame(): Promise<Game> {
        const word = await this.wordService.getRandomWord('NL', 5);
        return new Game(word);
    }

    public handleGuess(game: Game, guessMessage: GuessMessage): GuessResponse {
        if(game.attempts < 5) {
            const result = this.evaluateGuess(guessMessage.guess, game.currentWord);
            game.attempts += 1;

            return result;
        }

        return null;
    }

    private evaluateGuess(guess: string, currentWord: Word): GuessResponse {
        this.logger.log(`Comparing: ${guess} to the current word: ${currentWord.text}`);

        const guessChars = guess.split('');
        const result = new Array<CharResult>();
         guessChars.forEach((char, index) => {
             let charResultStatus;
             if(currentWord.containsCharacter(char)) {
                if(currentWord.containsCharacterInSamePosition(char, index)) {
                    charResultStatus = CharResultStatus.correct
                } else {
                    charResultStatus = CharResultStatus.correctWithoutPosition;
                }
             } else {
                charResultStatus = CharResultStatus.incorrect;
             }

             result.push(new CharResult(char, charResultStatus));
         });

         return this.buildGuessResponse(guess, result);
    }

    private buildGuessResponse(guess:string, charResults: Array<CharResult>): GuessResponse {
        let result: GuessResponse;
        const incorrectCharResults = charResults.filter(charResult => {
            return charResult.resultStatus === CharResultStatus.correctWithoutPosition || charResult.resultStatus === CharResultStatus.incorrect;
        });
        console.log(incorrectCharResults.length > 0);
        if(incorrectCharResults.length === 0) {
            this.logger.log(`Guess: '${guess}' correct!`);
            result = new GuessResponse(true, guess, charResults);
        } else {
            this.logger.log(`Guess: '${guess}' incorrect!`);
            result = new GuessResponse(false, guess, charResults);
        }

        return result;
    }
}