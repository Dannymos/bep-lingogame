import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameSessionManager } from "../services/GameSessionManager";
import { Inject, Logger } from "@nestjs/common";
import { GuessMessage } from "../model/contracts/GuessMessage";
import { GuessResponse } from "../model/contracts/GuessResponse";
import { GameService } from "../services/GameService";
import { GameStatus } from "../model/contracts/GameStatus";
import { GuessResponseStatus } from "../model/contracts/GuessResponseStatus";
import { HighscoreMessage } from "../model/contracts/HighscoreMessage";
import { HighscoreService } from "../../HighscoreModule/services/HighscoreService";

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @Inject(GameSessionManager)
    private gameSessionManager: GameSessionManager;

    @Inject(GameService)
    private gameService: GameService;

    @Inject(HighscoreService)
    private highscoreService: HighscoreService;

    @Inject(Logger)
    private logger: Logger;

    @WebSocketServer()
    server: Server;

    public async handleConnection(client: Socket): Promise<void>{
        this.logger.log(`Client connected: ${client.id}`);
        const newGameInfo = await this.gameSessionManager.initializeNewGameSession(client.id);
        if(newGameInfo !== null) {
            client.emit('initialized', newGameInfo);
        } else {
            client.emit('initialized', null);
        }
    }

    public async handleDisconnect(client: Socket): Promise<void>{
        this.logger.log(`Client disconnected: ${client.id}`);
        this.gameSessionManager.deleteGameSessionByClientId(client.id);
    }

    @SubscribeMessage('guess')
    public async handleGuess(@MessageBody() data: GuessMessage): Promise<GuessResponse> {
        this.logger.log(`Received guess from: ${data.clientId}, guess: ${data.guess}`);

        const gameSession = this.gameSessionManager.getGameSessionByClientId(data.clientId);
        if(gameSession === undefined) {
            this.logger.error(`Could not find game for client: ${data.clientId}`);

            return new GuessResponse(GuessResponseStatus.error, data.guess, null , null);
        } else if(gameSession.game.status === GameStatus.gameOver) {
            this.logger.error(`Client: ${data.clientId}'s game has ended, and is not allowed to makes guesses`);

            return new GuessResponse(GuessResponseStatus.error, data.guess, null, null);
        } else {
            return await this.gameService.handleGuess(gameSession.game, data);
        }
    }

    @SubscribeMessage('highscore')
    public async submitHighscore(@MessageBody() data: HighscoreMessage): Promise<boolean> {
        this.logger.log(`Received highscore from: ${data.clientId}, name: ${data.name}`);

        const gameSession = this.gameSessionManager.getGameSessionByClientId(data.clientId);
        if(gameSession === undefined) {
            this.logger.error(`Could not find game for client: ${data.clientId}`);

            return false;
        }
        if(gameSession.game.status === GameStatus.gameOver) {
            const highscore = await this.highscoreService.createHighscore(data.name, gameSession.game.score);
            if(highscore === null) {
                this.logger.error(`Could not save highscore for client: ${data.clientId}`);

                return false;
            }
            this.logger.log(`Highscore saved for client: ${data.clientId}`);

            return true;
        }

        this.logger.error(`Game for client: ${data.clientId} is not over yet!`);

        return false;

    }
}