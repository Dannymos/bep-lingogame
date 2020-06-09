import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {GameSessionManager} from "../services/GameSessionManager";
import { Inject } from "@nestjs/common";

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @Inject(GameSessionManager)
    private gameSessionManager: GameSessionManager;

    @WebSocketServer()
    server: Server;

    async handleConnection(client: Socket, data: any): Promise<void>{
        console.log(`Client connected: ${client.id}`);
        const initialized = this.gameSessionManager.initializeNewGameSession(client.id);
        if(initialized) {
            client.emit('initialized', true);
        } else {
            client.emit('initialized', false);
        }
    }

    async handleDisconnect(client: Socket){
        console.log(`Client disconnected: ${client.id}`);
        this.gameSessionManager.deleteGameSessionByClientId(client.id);
    }

    @SubscribeMessage('game')
    async game(client: Socket, @MessageBody() data: string): Promise<string> {
        const gameSession = this.gameSessionManager.getGameSessionByClientId(data);
        return "Game found!"
    }

    @SubscribeMessage('guess')
    async guess(client: Socket, @MessageBody() data: string): Promise<string> {
        const gameSession = this.gameSessionManager.getGameSessionByClientId(data);
        return "Game found!"
    }
}