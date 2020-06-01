import { Module } from '@nestjs/common';
import { HealthController } from '../controllers/HealthController';
import { HealthService } from '../services/HealthService';
import { DatabaseModule } from "./DatabaseModule";
import { WordRegistrationModule } from "./WordRegistrationModule";
import { Connection } from "typeorm";

@Module({
  imports: [
      DatabaseModule,
      WordRegistrationModule
  ],
  controllers: [
      HealthController
  ],
  providers: [HealthService],
})
export class AppModule {
    constructor(private connection: Connection) {
    }
}
