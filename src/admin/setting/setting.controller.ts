import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ClassValidatorPipe } from '../../core/pipes/validationPipe';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';

@Controller('setting')
@UseInterceptors(ResponseInterceptor)
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post()
  @UsePipes(ClassValidatorPipe)
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingService.create(createSettingDto);
  }

  @Get()
  findAll() {
    return this.settingService.findAll();
  }

  @Get(':_id')
  findOne(@Param('_id') id: string) {
    return this.settingService.findOne(id);
  }

  @Patch(':_id')
  update(@Param('_id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingService.update(id, updateSettingDto);
  }

  @Delete(':_id')
  remove(@Param('_id') id: string) {
    return this.settingService.remove(id);
  }
}
