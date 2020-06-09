import { Module } from '@nestjs/common';
import { DatabaseModule } from "./DatabaseModule";
import { WordModule } from "./WordModule/WordModule";
import { HealthModule } from "./HealthModule/HealthModule";
import { GameModule } from "./GameModule/GameModule";

@Module({
  imports: [
      DatabaseModule,
      WordModule,
      HealthModule,
      GameModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
