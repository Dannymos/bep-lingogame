import { Module } from '@nestjs/common';
import { DatabaseModule } from "./DatabaseModule";
import { WordModule } from "./WordModule/WordModule";
import { HealthModule } from "./HealthModule/HealthModule";
import { GameModule } from "./GameModule/GameModule";
import { HighscoreModule } from "./HighscoreModule/HighscoreModule";

@Module({
  imports: [
      DatabaseModule,
      WordModule,
      HealthModule,
      HighscoreModule,
      GameModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
