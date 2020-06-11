import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameSessionManager } from "../services/GameSessionManager";
import { Inject, Logger } from "@nestjs/common";
import { GuessMessage } from "../model/contracts/GuessMessage";
import { GuessResponse } from "../model/contracts/GuessResponse";
import { GameService } from "../services/GameService";

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @Inject(GameSessionManager)
    private gameSessionManager: GameSessionManager;

    @Inject(GameService)
    private gameService: GameService;

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
    public async guess(client: Socket, @MessageBody() data: GuessMessage): Promise<GuessResponse> {
        this.logger.log(`Received guess from: ${data.clientId}, guess: ${data.guess}`);

        const gameSession = this.gameSessionManager.getGameSessionByClientId(data.clientId);
        if(gameSession === null) {
            this.logger.error(`Could not find game for client: ${data.clientId}`);
        }

        const response = await this.gameService.handleGuess(gameSession.game, data);
        if(response === null) {
            this.logger.error(`Something went wrong when evaluating guess for client: ${data.clientId}`);
        }

        return response;
    }
}