import {Game} from "../model/Game";
import {GuessMessage} from "../model/contracts/GuessMessage";
import {WordService} from "../../WordModule/services/WordService";
import {Inject, Logger} from "@nestjs/common";
import {CharResult} from "../model/contracts/CharResult";
import {Word} from "../../WordModule/model/entities/Word.entity";
import {GuessResponse} from "../model/contracts/GuessResponse";
import {CharResultStatus} from "../model/contracts/CharResultStatus";
import {NewRoundInfo} from "../model/contracts/NewRoundInfo";
import {GameStatus} from "../model/contracts/GameStatus";
import {GuessResponseStatus} from "../model/contracts/GuessResponseStatus";

export class GameService {

    @Inject(Logger)
    private logger: Logger;

    @Inject(WordService)
    private wordService: WordService;

    public async initializeNewGame(): Promise<Game> {
        const word = await this.wordService.getRandomWord('NL', 5);
        return new Game(word);
    }

    public async handleGuess(game: Game, guessMessage: GuessMessage): Promise<GuessResponse> {
        game.attempts = game.attempts + 1;
        const result = this.evaluateGuess(guessMessage.guess, game.currentWord);
        if(result.status === GuessResponseStatus.incorrect && game.attempts === 5) {
            game.status = GameStatus.gameOver;
            result.gameStatus = game.status;
        }
        else if(result.status === GuessResponseStatus.correct) {
            result.newRoundInfo = await this.startNewRound(game);
        }

        return result;
    }

    private async startNewRound(game: Game): Promise<NewRoundInfo> {
        try {
            const nextWordLength = game.getNextWordLength();
            let nextWord: Word;
            if(game.previousWords.length === 0) {
                nextWord = await this.wordService.getRandomWord('NL', nextWordLength);
            } else {
                nextWord = await this.wordService.getRandomWord('NL', nextWordLength, game.previousWords);
            }

            return game.startNewRound(nextWord);
        } catch(exception) {
            this.logger.error(exception);
            return null;
        }

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
                    charResultStatus = CharResultStatus.present;
                }
             } else {
                charResultStatus = CharResultStatus.absent;
             }

             result.push(new CharResult(char, charResultStatus));
         });

         return this.buildGuessResponse(guess, result);
    }

    private buildGuessResponse(guess:string, charResults: Array<CharResult>): GuessResponse {
        let result: GuessResponse;
        const incorrectCharResults = charResults.filter(charResult => {
            return charResult.resultStatus === CharResultStatus.present || charResult.resultStatus === CharResultStatus.absent;
        });
        if(incorrectCharResults.length === 0) {
            this.logger.log(`Guess: '${guess}' correct!`);
            result = new GuessResponse(GuessResponseStatus.correct, guess, charResults, GameStatus.active);
        } else {
            this.logger.log(`Guess: '${guess}' incorrect!`);
            result = new GuessResponse(GuessResponseStatus.incorrect, guess, charResults, GameStatus.active);
        }

        return result;
    }
}