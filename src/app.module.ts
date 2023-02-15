import { PrismaClient } from '@prisma/client';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SESModule } from './SES/ses.module';

@Module({
  imports: [PrismaClient, SESModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
