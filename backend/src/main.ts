import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // バリデーションパイプの設定
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORSを有効化
  app.enableCors({
    origin: ['http://localhost:5137', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Swaggerの設定
  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('NestJS + Prismaで作るTodoアプリのAPI仕様書')
    .setVersion('1.0')
    .addTag('todos', 'Todo関連のAPI')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`サーバーが起動しました: http://localhost:${port}`);
  console.log(`API仕様書: http://localhost:${port}/api`);
}

bootstrap().catch((error) => {
  console.error('サーバー起動中にエラーが発生しました:', error);
  process.exit(1);
});
