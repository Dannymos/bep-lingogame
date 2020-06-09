import { GameSession } from "../model/GameSession";
import {Game} from "../model/Game";

export class GameSessionManager {

    private gameSessions: Array<GameSession> = new Array<GameSession>();

    initializeNewGameSession(clientId: string): boolean {
        const game = new Game();
        const gameSession = new GameSession(clientId, game);
        this.gameSessions.push(gameSession);

        return true;
    }

    getGameSessionByClientId(clientId: string): GameSession {
        return this.gameSessions.find(gameSession => gameSession.clientId === clientId);
    }

    deleteGameSessionByClientId(clientId: string): void {
        this.gameSessions = this.gameSessions.filter((gameSession) =>  gameSession.clientId !== clientId);
    }
}