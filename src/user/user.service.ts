import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userEntity: Model<UserEntity>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const create = await this.userEntity.create(createUserDto);
      const data = await create.save();
      return {
        message: '创建成功',
        data,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  async findAll({ page, limit, account }) {
    const query: any = {};
    if (account) {
      query.account = { $regex: new RegExp(account, 'i') };
    }
    const [list, total] = await Promise.all([
      this.userEntity
        .find(query)
        .select(
          '_id account nickName avatar email role status createdAt updatedAt',
        )
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.userEntity.countDocuments(query).exec(),
    ]);
    return { data: { total, list } };
  }

  async validateGithubUser(profile: any) {
    const { username: account, emails, photos, displayName } = profile;

    let user = await this.userEntity.findOne({ account });
    if (!user) {
      user = await this.userEntity.create({
        account,
        nickName: displayName || account,
        email: emails ? emails[0].value : null,
        avatar: photos ? photos[0].value : null,
        role: 'default',
      });
    }

    return user.toObject();
  }
  async findOne(id: number) {
    const data = await this.userEntity.findById(id);
    return {
      data,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userEntity.findById(id);
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    Object.assign(user, updateUserDto);
    const data = await user.save();
    return {
      data,
      message: '更新成功',
    };
  }

  async remove(id: string) {
    const data = await this.userEntity.findByIdAndDelete(id);
    if (!data) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    return {
      data: null,
      message: '删除成功',
    };
  }
}
