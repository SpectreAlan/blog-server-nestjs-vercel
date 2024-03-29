import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { setToken } from '../../core/utils/common';
import { LoginSmsDto } from './dto/login-sms.dto';

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

  async login(loginUserDto: LoginUserDto, code: string) {
    const { account, password, captcha } = loginUserDto;
    if (!code || !captcha || code?.toLowerCase() !== captcha?.toLowerCase()) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userEntity.findOne({ account });
    if (!user) {
      throw new HttpException('用户名/密码不正确', HttpStatus.BAD_REQUEST);
    }
    const result = await bcrypt.compare(password, user?.password);
    if (result) {
      const { _id, role, avatar, account, nickName, email, status } =
        user.toObject();
      if (status) {
        const data = { id: _id, role, avatar, account, nickName, email };
        const token = setToken(role, account);
        return {
          data: { ...data, token },
          message: 'success',
        };
      }
      throw new HttpException(
        '用户已禁用，请联系管理系',
        HttpStatus.BAD_REQUEST,
      );
    }
    throw new HttpException('用户名/密码不正确', HttpStatus.BAD_REQUEST);
  }
  async loginSms(loginSmsDto: LoginSmsDto, req) {
    const session: { user: UserEntity; sms: number } | null = req.session?.sms;
    if (!session) {
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    }
    const { phone, sms } = loginSmsDto;
    const { sms: smsSession, user } = session;
    if (
      !smsSession ||
      !sms ||
      sms !== String(smsSession) ||
      phone !== user.phone
    ) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { _id, role, avatar, account, nickName, email, status } = user;
    delete req.session.sms;
    if (status) {
      const data = { id: _id, role, avatar, account, nickName, email };
      const token = setToken(role, account);
      return {
        data: { ...data, token },
        message: 'success',
      };
    }
    throw new HttpException('用户已禁用，请联系管理系', HttpStatus.BAD_REQUEST);
  }

  async findAll({ page, limit, account, status, role, email }) {
    const query: any = {};
    if (account) {
      query.account = { $regex: new RegExp(account, 'i') };
    }
    if (status) {
      query.status = status;
    }
    if (role) {
      query.role = { $regex: new RegExp(role, 'i') };
    }
    if (email) {
      query.email = { $regex: new RegExp(email, 'i') };
    }
    const [list, total] = await Promise.all([
      this.userEntity
        .find(query)
        .sort({ createdAt: -1 })
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

  async findOne(id: string) {
    const data = await this.userEntity.findById(id);
    return {
      data,
    };
  }

  async findByPhone(phone: number) {
    return this.userEntity.findOne({ phone });
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

  async updatePassword(updatePasswordUserDto: UpdatePasswordUserDto) {
    const { password, id, oldPassword } = updatePasswordUserDto;
    const user = await this.userEntity.findById(id);
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (user.password) {
      const result = await bcrypt.compare(oldPassword, user.password);
      if (!result) {
        throw new HttpException('旧密码不正确', HttpStatus.BAD_REQUEST);
      }
    }
    const saltRounds = 10;
    updatePasswordUserDto.password = await bcrypt.hash(password, saltRounds);
    Object.assign(user, updatePasswordUserDto);
    await user.save();
    return {
      data: null,
      message: '修改成功',
    };
  }

  async remove(ids: MongooseSchema.Types.ObjectId[]) {
    const data = await this.userEntity.deleteMany({
      _id: { $in: ids },
    });
    if (data.deletedCount === 0) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    return {
      data: null,
      message: '删除成功',
    };
  }
}
