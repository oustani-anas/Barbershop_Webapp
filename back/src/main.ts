import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  
  
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['https://barbershop-webapp-git-main-oustanis-projects.vercel.app/'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allowed HTTP methods
    credentials: true, // If you're sending cookies or authorization headers
  });


  await app.listen(process.env.PORT ?? 9000, '0.0.0.0');
}
bootstrap();
