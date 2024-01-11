import { Response as ExpressResponse } from 'express';
import { sign } from 'jsonwebtoken';

export const getAliOSSConfig = () => {
  return {
    region: process.env.NEXT_PUBLIC_OSS_ALIYUN_REGION,
    accessKeyId: process.env.NEXT_PUBLIC_OSS_ALIYUN_RKEY,
    accessKeySecret: process.env.NEXT_PUBLIC_OSS_ALIYUN_SECRET,
    bucket: process.env.NEXT_PUBLIC_OSS_ALIYUN_BUCKET,
  };
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
    'http://localhost:3000/home.html?token=' + encodeURIComponent(encodedUser),
  );
};
