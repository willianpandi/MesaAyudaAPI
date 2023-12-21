import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as morgan from "morgan";
import { ValidationPipe } from '@nestjs/common';
import { CORS } from './constants/cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'))
  app.useGlobalPipes( 
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  app.enableCors();
  app.setGlobalPrefix('api');
  
  const config = new DocumentBuilder()
    .setTitle('Mesa de Ayuda API')
    .setDescription('Aplicacion de menejo de gestion de tareas y tickets')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  

  const configService = app.get(ConfigService);



  await app.listen(configService.get('PORT'));
  console.log(`Aplicacion corriendo en: ${await app.getUrl()}`);
}
bootstrap();
