import { NestFactory } from '@nestjs/core';
import "reflect-metadata";
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: [process.env.FRONTEND_URL, 'https://vivamed.stevanini.com.br', 'https://vivamedbji.vercel.app'], // Adicione outras origens se necessário
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.listen(8000);
}
bootstrap();
