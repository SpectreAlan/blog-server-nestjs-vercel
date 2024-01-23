import { Response as ExpressResponse } from 'express';
import { sign } from 'jsonwebtoken';
import * as OSS from 'ali-oss';

export const responseLoginResult = (res: ExpressResponse, user) => {
  const { status, nickName, role, avatar, _id: id, password, account } = user;
  let encodedUser: string = 'null';
  if (status) {
    encodedUser = Buffer.from(
      JSON.stringify({
        nickName,
        role,
        avatar,
        status,
        id,
        hasPassword: !!password,
      }),
    ).toString('base64');
    const token = setToken(role, account);
    res.cookie('token', token, { httpOnly: true });
  }
  return res.redirect(
    process.env.GITHUB_REDIRECT_URL + encodeURIComponent(encodedUser),
  );
};

export const setToken = (role: string, account: string) => {
  return sign({ account, role }, process.env.SECRET_KEY, {
    expiresIn: '1h',
  });
};

export const aliOSS = () => {
  return new OSS({
    region: process.env.OSS_ALIYUN_REGION,
    accessKeyId: process.env.OSS_ALIYUN_KEY,
    accessKeySecret: process.env.OSS_ALIYUN_SECRET,
    bucket: process.env.OSS_ALIYUN_BUCKET,
  });
};

export const statisticsByMonth = async (entity, start, end) => {
  return await entity.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(start),
          $lte: new Date(end),
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: 1,
          },
        },
        count: 1,
      },
    },
    {
      $project: {
        month: { $dateToString: { format: '%Y-%m', date: '$month' } },
        count: 1,
      },
    },
  ]);
};
export const statisticsByDay = async (entity, start, end) => {
  return await entity.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(start),
          $lte: new Date(end),
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        day: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day',
          },
        },
        count: 1,
      },
    },
    {
      $project: {
        day: { $dateToString: { format: '%Y-%m-%d', date: '$day' } },
        count: 1,
      },
    },
  ]);
};
