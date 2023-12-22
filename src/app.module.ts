import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as process from 'process';

@Module({
  imports: [MongooseModule.forRoot(process.env.DB_HOST)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
