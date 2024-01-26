# 博客后台服务
Personal blog backend service developed based on Nestjs, Related [Backstage Management Department](https://github.com/SpectreAlan/blog-admin-umijs-max)
# How to use
```bash
# Clone to local
git clone https://github.com/SpectreAlan/blog-server-nestjs-vercel.git
# Switch working directory
cd blog-server-nestjs-vercel
# Install dependencies
pnpm install
# Running locally
pnpm start
```
# Environmental requirements
> node >>> 16.x
# Project configuration
Create .env in the project root directory,Fill in the following content
```txt
// .env
DB_CONNECTION_URL=mongodb link address

GITHUB_CLIENT_ID=GITHUB CLIENT ID
GITHUB_CLIENT_SECRET=GITHUB CLIENT SECRET
GITHUB_CALLBACK_URL=GITHUB CALLBACK URL
GITHUB_REDIRECT_URL=GITHUB REDIRECT URL

OSS_ALIYUN_REGION=OSS ALIYUN REGION
OSS_ALIYUN_KEY=OSS ALIYUN KEY
OSS_ALIYUN_SECRET=OSS ALIYUN SECRET
OSS_ALIYUN_BUCKET=OSS ALIYUN BUCKET
OSS_ALIYUN_DIR=OSS ALIYUN DIR
SECRET_KEY=jwt SECRET KEY
CRYPTO_SECRET_KEY=CRYPTO SECRET KEY
PORT=Project running port
```
Basic example
```javascript
DB_CONNECTION_URL=mongodb+srv://user:password@mongodb.examp.com

GITHUB_CLIENT_ID=xxxx
GITHUB_CLIENT_SECRET=xxx
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
GITHUB_REDIRECT_URL=http://localhost:4000/home?token=

OSS_ALIYUN_REGION=oss-cn-xxx
OSS_ALIYUN_KEY=xxx
OSS_ALIYUN_SECRET=xxx
OSS_ALIYUN_BUCKET=xxx
OSS_ALIYUN_DIR=xxx
SECRET_KEY=xxx
CRYPTO_SECRET_KEY=xxx
PORT=3000

```
> Tips: CRYPTO_SECRET_KEY needs to be consistent with the front end