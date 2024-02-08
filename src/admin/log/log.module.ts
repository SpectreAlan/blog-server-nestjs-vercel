import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LogSchema } from './entities/log.entity';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Log', schema: LogSchema }])],
  exports: [LogService],
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
