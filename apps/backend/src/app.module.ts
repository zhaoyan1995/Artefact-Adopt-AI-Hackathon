import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.modules';
import { AIModule } from './modules/ai/ai.module';

@Module({
  imports: [HealthModule, DatabaseModule, UsersModule, AIModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
