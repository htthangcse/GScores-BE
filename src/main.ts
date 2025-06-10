declare const module: any;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './validation.pipe'
import { env } from './config/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // Cho phép truy cập từ frontend Vite
    credentials: true, // Nếu bạn cần gửi cookie / header
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || env.APP_PORT || 3000, () => {
    console.log('Server is running on port', process.env.PORT || env.APP_PORT || 3000);
  });
  // await app.listen(3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
