import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { PoemModule } from '../poem/poem.module';

@Module({
  imports: [PoemModule],
  providers: [ScheduleService],
})
export class ScheduleCustomModule {}
