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
  const data = await entity.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start,
          $lte: end,
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
  return getMonthEchartsOption(start, end, data);
};
export const statisticsByDay = async (entity, start, end) => {
  const data = await entity.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start,
          $lte: end,
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
  return getDaysEchartsOption(start, end, data);
};

export const getMonthEchartsOption = (start, end, data) => {
  const xAxis = [];
  const series = [];
  const o = {};
  data.map(({ count, month }) => (o[month] = count));

  while (start <= end) {
    const year = start.getFullYear();
    const month = start.getMonth() + 1;
    const formattedMonth = `${year}-${month.toString().padStart(2, '0')}`;
    xAxis.push(formattedMonth);
    series.push(o[formattedMonth] || 0);

    start.setMonth(start.getMonth() + 1);
  }
  return {
    xAxis,
    series,
  };
};
export const getDaysEchartsOption = (start, end, data) => {
  const xAxis = [];
  const series = [];
  const o = {};
  data.map(({ count, day }) => (o[day] = count));

  while (start <= end) {
    const day = start.toISOString().split('T')[0];
    xAxis.push(day);
    start.setDate(start.getDate() + 1);
    series.push(o[day] || 0);
  }
  return {
    xAxis,
    series,
  };
};
