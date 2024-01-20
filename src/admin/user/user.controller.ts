import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UsePipes,
  Query,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClassValidatorPipe } from '../../core/pipes/validationPipe';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';
import { AdminInterceptor } from '../../core/interceptors/admin.interceptor';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { DeleteItemsDto } from '../poem/dto/delete-common.dto';

@Controller('user')
@UseInterceptors(ResponseInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(AdminInterceptor)
  @UsePipes(ClassValidatorPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  @UsePipes(ClassValidatorPipe)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
  @Get()
  @UseInterceptors(AdminInterceptor)
  findAll(
    @Query('current') page: number = 1,
    @Query('pageSize') limit: number = 10,
    @Query('account') account: string,
  ) {
    return this.userService.findAll({ page, limit, account });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post('updatePassword')
  @UsePipes(ClassValidatorPipe)
  updatePassword(@Body() updatePasswordUserDto: UpdatePasswordUserDto) {
    return this.userService.updatePassword(updatePasswordUserDto);
  }

  @Delete()
  @UsePipes(ClassValidatorPipe)
  remove(@Body() deleteItemsDto: DeleteItemsDto) {
    return this.userService.remove(deleteItemsDto.ids);
  }
}
