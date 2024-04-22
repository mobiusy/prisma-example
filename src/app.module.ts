import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'nestjs-prisma';
import { DbModule } from './db/db.module';

@Module({
  imports: [PrismaModule.forRoot(), DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
