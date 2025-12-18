import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

console.log('🔍 Environment Check:');
console.log('PORT:', process.env.PORT || '3001 (default)');
console.log('MONGODB_URI:', process.env.MONGODB_URI ?
  process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') :
  'NOT SET - using default');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ SET' : '⚠ NOT SET');


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown fields (GOOD)
      transform: true, // converts string -> number if DTO types are number
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Backend server is running on http://localhost:${port}`);
}
bootstrap();
