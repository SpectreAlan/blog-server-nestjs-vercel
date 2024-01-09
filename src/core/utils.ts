export const getAliOSSConfig = () => {
  return {
    region: process.env.NEXT_PUBLIC_OSS_ALIYUN_REGION,
    accessKeyId: process.env.NEXT_PUBLIC_OSS_ALIYUN_RKEY,
    accessKeySecret: process.env.NEXT_PUBLIC_OSS_ALIYUN_SECRET,
    bucket: process.env.NEXT_PUBLIC_OSS_ALIYUN_BUCKET,
  };
};
