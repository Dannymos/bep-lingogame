import {Game} from "./Game";

export class GameSession {

    public game: Game;

    public clientId: string;

    constructor(clientId: string, game: Game) {
        this.game = game;
        this.clientId = clientId;
    }
}