import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import "reflect-metadata";
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Vivamed API')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(
    '/docs',
    apiReference({
      theme: 'purple',
      spec: {
        content: document,
      },
    }),
  )

  app.enableCors({
    credentials: true,
    origin: [process.env.FRONTEND_URL, 'http://localhost:3000', 'https://vivamed.stevanini.com.br', 'https://vivamedbji.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(8000);
}
bootstrap();
