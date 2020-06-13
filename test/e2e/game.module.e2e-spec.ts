import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from "../../src/modules/AppModule";
import { TestUtilities } from "./utilities/test.utilities";
import { HighscoreService } from "../../src/modules/HighscoreModule/services/HighscoreService";
import { GameSessionManager } from "../../src/modules/GameModule/services/GameSessionManager";

describe('GameModule (e2e)', () => {
    let app: INestApplication;
    let baseAddress: string;
    let testingUtilities: TestUtilities;
    let gameSessionManager: GameSessionManager;
    let highscoreService: HighscoreService;

    beforeAll(async () => {
        jest.setTimeout(10000);
        const module = await Test.createTestingModule({
            imports: [
                AppModule,
            ],
            providers: [
                TestUtilities
            ]
        }).compile();

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();


        const address = await app.getHttpServer().listen().address();
        baseAddress = `http://localhost:${address.port}`;

        testingUtilities = app.get<TestUtilities>(TestUtilities);
        highscoreService = app.get<HighscoreService>(HighscoreService);
        gameSessionManager = app.get<GameSessionManager>(GameSessionManager);
    });

    beforeEach(async () => {
        await testingUtilities.loadFixtures();
    });

    describe('InitializeGame', () => {
        it('Should return NewRoundInfo when connection is made (WEBSOCKET)', (done) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const io = require('socket.io-client')
            const client = io.connect(baseAddress);
            client.addEventListener('initialized', (response: any) => {
                expect(response).toStrictEqual({"_firstCharacter": "w", "_roundNumber": 1, "_wordLength": 5});
                client.disconnect();
                done();
            })
            client.on('connection', (response: any) => {
                console.log(response);
            });
        });
    });

    describe('Disconnect', () => {
        it('Should delete game when client disconnects (WEBSOCKET)', (done) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const io = require('socket.io-client')
            const client = io.connect(baseAddress);

            const spy = jest.spyOn(gameSessionManager, 'deleteGameSessionByClientId');

            client.on('initialized', () => {
                client.disconnect();
            });

            //Wait for server to finish deleting session before asserting
            setTimeout(() => {
                expect(spy).toHaveBeenCalled();
                done();
            }, 1000);
        });
    });

    describe('handleGuess', () => {
        it('Should return feedback when client sends an incorrect guess (WEBSOCKET)', (done) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const io = require('socket.io-client')
            const client = io.connect(baseAddress);
            client.on('initialized', () => {

                const mockGuess = {
                    clientId: client.id,
                    guess: "wordx"
                }

                client.emit('guess', mockGuess,(response: any) => {
                    expect(response._status).toBe("incorrect");
                    expect(response).toStrictEqual({"_feedback": [{"char": "w", "resultStatus": "correct"}, {"char": "o", "resultStatus": "correct"}, {"char": "r", "resultStatus": "correct"}, {"char": "d", "resultStatus": "correct"}, {"char": "x", "resultStatus": "absent"}], "_gameStatus": "Active", "_guess": "wordx", "_status": "incorrect"});
                    client.disconnect();
                    done();
                });
            });
        });

        it('Should end game after 5 wrong attempts (WEBSOCKET)', (done) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const io = require('socket.io-client')
            const client = io.connect(baseAddress);
            client.on('initialized', () => {

                const mockGuess = {
                    clientId: client.id,
                    guess: "xxxxx"
                }

                client.emit('guess', mockGuess,() => {
                    client.emit('guess', mockGuess,() => {
                        client.emit('guess', mockGuess,() => {
                            client.emit('guess', mockGuess,() => {
                                client.emit('guess', mockGuess,(response: any) => {
                                    expect(response._gameStatus).toBe("Game over");
                                    expect(response._status).toBe("incorrect");
                                    client.disconnect();
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });

        it('Should return feedback and start a new 6-letter word round when client sends a correct guess (WEBSOCKET)', (done) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const io = require('socket.io-client')
            const client = io.connect(baseAddress);
            client.on('initialized', () => {

                const mockGuess = {
                    clientId: client.id,
                    guess: "worda"
                }

                client.emit('guess', mockGuess,(response: any) => {
                    expect(response._status).toBe("correct");
                    expect(response._gameStatus).toBe("Active");
                    expect(response._newRoundInfo._roundNumber).toBe(2);
                    expect(response._newRoundInfo._wordLength).toBe(6);
                    client.disconnect();
                    done();
                });
            });
        });

        it('wordlengths should be 5-letter, 6-letter, 7-letter, and then 5-letter again for rounds 1, 2, 3 and 4 (WEBSOCKET)', (done) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const io = require('socket.io-client')
            const client = io.connect(baseAddress);
            client.on('initialized', () => {

                const mockGuess = {
                    clientId: client.id,
                    guess: "worda"
                }

                client.emit('guess', mockGuess, (response: any) => {
                    expect(response._status).toBe("correct");
                    expect(response._gameStatus).toBe("Active");
                    expect(response._newRoundInfo._roundNumber).toBe(2);
                    expect(response._newRoundInfo._wordLength).toBe(6);

                    const mockGuess = {
                        clientId: client.id,
                        guess: "aworda"
                    }

                    client.emit('guess', mockGuess, (response: any) => {
                        expect(response._status).toBe("correct");
                        expect(response._gameStatus).toBe("Active");
                        expect(response._newRoundInfo._roundNumber).toBe(3);
                        expect(response._newRoundInfo._wordLength).toBe(7);

                        const mockGuess = {
                            clientId: client.id,
                            guess: "aworhaa"
                        }

                        client.emit('guess', mockGuess, (response: any) => {
                            expect(response._status).toBe("correct");
                            expect(response._gameStatus).toBe("Active");
                            expect(response._newRoundInfo._roundNumber).toBe(4);
                            expect(response._newRoundInfo._wordLength).toBe(5);
                            client.disconnect();
                            done();
                        });
                    });
                });
            });
        });

        it('Should return error when game cannot be found (WEBSOCKET)', (done) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const io = require('socket.io-client')
            const client = io.connect(baseAddress);
            client.on('initialized', () => {

                const mockGuess = {
                    clientId: "arandomnonexistingid",
                    guess: "wordx"
                }

                client.emit('guess', mockGuess,(response: any) => {
                    expect(response._status).toBe("error");
                    client.disconnect();
                    done();
                });
            });
        });
    });

    describe('submitHighscore', () => {


        it('Should NOT be able to submit highscore when game is active (WEBSOCKET)', (done) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const io = require('socket.io-client')
            const client = io.connect(baseAddress);

            const spy = jest.spyOn(highscoreService, 'createHighscore');

            client.on('initialized', () => {
                const mockHighscore = {
                    clientId: client.id,
                    name: "test"
                }

                client.emit('highscore', mockHighscore, (response: any) => {
                    expect(response).toBe(false);
                    expect(spy).not.toHaveBeenCalled();
                    client.disconnect();
                    done();
                });
            });
        });

        it('Should return error when submitting highscore when game cannot be found (WEBSOCKET)', (done) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const io = require('socket.io-client')
            const client = io.connect(baseAddress);

            const spy = jest.spyOn(highscoreService, 'createHighscore');

            client.on('initialized', () => {
                const mockHighscore = {
                    clientId: "arandominvalidclientid",
                    name: "test"
                }

                client.emit('highscore', mockHighscore, (response: any) => {
                    expect(response).toBe(false);
                    expect(spy).not.toHaveBeenCalled();
                    client.disconnect();
                    done();
                });
            });
        });

        it('Should be able to submit highscore when game is over (WEBSOCKET)', (done) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const io = require('socket.io-client')
            const client = io.connect(baseAddress);

            const spy = jest.spyOn(highscoreService, 'createHighscore');

            client.on('initialized', () => {
                const mockGuess = {
                    clientId: client.id,
                    guess: "xxxxx"
                }

                client.emit('guess', mockGuess,() => {
                    client.emit('guess', mockGuess,() => {
                        client.emit('guess', mockGuess,() => {
                            client.emit('guess', mockGuess,() => {
                                client.emit('guess', mockGuess,(response: any) => {
                                    expect(response._gameStatus).toBe("Game over");
                                    expect(response._status).toBe("incorrect");

                                    const mockHighscore = {
                                        clientId: client.id,
                                        name: "test"
                                    }

                                    client.emit('highscore', mockHighscore, (response: any) => {
                                        expect(response).toBe(true);
                                        expect(spy).toHaveBeenCalled();
                                        client.disconnect();
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
