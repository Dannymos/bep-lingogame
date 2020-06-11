import { GameSession } from "../model/GameSession";
import { GameService } from "./GameService";
import { Inject, Logger } from "@nestjs/common";
import {NewRoundInfo} from "../model/contracts/NewRoundInfo";

export class GameSessionManager {

    private gameSessions: Array<GameSession> = new Array<GameSession>();

    @Inject(GameService)
    private gameService: GameService;

    @Inject(Logger)
    private logger: Logger;

    public async initializeNewGameSession(clientId: string): Promise<NewRoundInfo> {
        try {
            const game = await this.gameService.initializeNewGame();
            const gameSession = new GameSession(clientId, game);
            this.gameSessions.push(gameSession);

            return new NewRoundInfo(game.currentWord.text.length, game.currentWord.getFirstCharacter(), game.roundNumber);
        } catch(exception) {
            this.logger.error(exception);
            return null;
        }
    }

    public getGameSessionByClientId(clientId: string): GameSession {
        return this.gameSessions.find(gameSession => gameSession.clientId === clientId);
    }

    public deleteGameSessionByClientId(clientId: string): void {
        this.gameSessions = this.gameSessions.filter((gameSession) =>  gameSession.clientId !== clientId);
    }
}