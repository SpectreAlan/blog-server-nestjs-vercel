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

export const getUnix = (minutes: number) => {
  const currentTime = new Date();
  const futureTime = new Date(currentTime.getTime() + minutes * 60 * 1000);
  const unixTimestamp = Math.floor(futureTime.getTime() / 1000);
  return unixTimestamp.toString();
};
