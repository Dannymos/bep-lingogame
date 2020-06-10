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
import {BadRequestException, Inject, Logger} from "@nestjs/common";
import { GuessMessage } from "../contracts/GuessMessage";
import { GuessResponse } from "../contracts/GuessResponse";
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

    async handleConnection(client: Socket, data: any): Promise<void>{
        this.logger.log(`Client connected: ${client.id}`);
        const initialized = await this.gameSessionManager.initializeNewGameSession(client.id);
        if(initialized) {
            client.emit('initialized', true);
        } else {
            client.emit('initialized', false);
        }
    }

    async handleDisconnect(client: Socket){
        this.logger.log(`Client disconnected: ${client.id}`);
        this.gameSessionManager.deleteGameSessionByClientId(client.id);
    }

    @SubscribeMessage('game')
    async game(client: Socket, @MessageBody() data: string): Promise<string> {
        const gameSession = this.gameSessionManager.getGameSessionByClientId(data);
        return "Game found!"
    }

    @SubscribeMessage('guess')
    async guess(client: Socket, @MessageBody() data: GuessMessage): Promise<GuessResponse> {
        this.logger.log(`Received guess from: ${data.clientId}, guess: ${data.guess}`);

        const gameSession = this.gameSessionManager.getGameSessionByClientId(data.clientId);
        if(gameSession === null) {
            this.logger.error('Game not found!');
        }

        const response = this.gameService.handleGuess(gameSession.game, data);
        if(response === null) {
            this.logger.error('Something went wrong during evaluation!');
        }

        return response;
    }
}