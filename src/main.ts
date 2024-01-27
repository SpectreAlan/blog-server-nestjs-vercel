import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
const session = require('express-session');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets('public');
  app.use(
    session({
      secret: 'blog-server-secret',
      rolling: true,
      name: 'blog-server',
      cookie: { maxAge: null },
    }),
  );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
