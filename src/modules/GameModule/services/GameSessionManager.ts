import { GameSession } from "../model/GameSession";
import { GameService } from "./GameService";
import { Inject, Logger } from "@nestjs/common";

export class GameSessionManager {

    private gameSessions: Array<GameSession> = new Array<GameSession>();

    @Inject(GameService)
    private gameService: GameService;

    @Inject(Logger)
    private logger: Logger;

    public async initializeNewGameSession(clientId: string): Promise<boolean> {
        try {
            const game = await this.gameService.initializeNewGame();
            const gameSession = new GameSession(clientId, game);
            this.gameSessions.push(gameSession);

            return true;
        } catch(exception) {
            this.logger.error(exception);
            return false
        }
    }

    public getGameSessionByClientId(clientId: string): GameSession {
        return this.gameSessions.find(gameSession => gameSession.clientId === clientId);
    }

    public deleteGameSessionByClientId(clientId: string): void {
        this.gameSessions = this.gameSessions.filter((gameSession) =>  gameSession.clientId !== clientId);
    }
}