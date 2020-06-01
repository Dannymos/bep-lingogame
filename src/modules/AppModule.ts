import { Module } from '@nestjs/common';
import { DatabaseModule } from "./DatabaseModule";
import { WordModule } from "./WordModule/WordModule";
import { Connection } from "typeorm";
import { HealthModule } from "./HealthModule/HealthModule";

@Module({
  imports: [
      DatabaseModule,
      WordModule,
      HealthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
    constructor(private connection: Connection) {
    }
}
