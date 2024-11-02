import { NestFactory } from '@nestjs/core';
import "reflect-metadata";
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: [process.env.FRONTEND_URL, 'https://fcff-168-195-162-240.ngrok-free.app', 'http://localhost:3000', 'https://vivamed.stevanini.com.br', 'https://vivamedbji.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.listen(8000);
}
bootstrap();
