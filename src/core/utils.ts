import { Response as ExpressResponse } from 'express';
import { sign } from 'jsonwebtoken';
import * as OSS from 'ali-oss';

export const aliOSS = () => {
  return new OSS({
    region: process.env.OSS_ALIYUN_REGION,
    accessKeyId: process.env.OSS_ALIYUN_KEY,
    accessKeySecret: process.env.OSS_ALIYUN_SECRET,
    bucket: process.env.OSS_ALIYUN_BUCKET,
  });
};

export const responseLoginResult = (res: ExpressResponse, user) => {
  const { status, nickName, role, avatar, account, _id: id, password } = user;
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
    const token = sign({ account, role }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });
    res.cookie('token', token, { httpOnly: true });
  }
  return res.redirect(
    process.env.GITHUB_REDIRECT_URL + encodeURIComponent(encodedUser),
  );
};
