import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from "morgan";
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { CORS } from './constants/cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  // app.use(morgan('dev'));
  app.useGlobalPipes( 
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors( new ClassSerializerInterceptor(reflector))

  app.enableCors(CORS);
  app.setGlobalPrefix('api');
  
  // DOCUMENTACION POR SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Mesa de Ayuda API')
    .setDescription('Mesa de Ayuda App endpoints')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  

  await app.listen( process.env.PORT );
  logger.log(`App corriendo en el puerto: ${ process.env.PORT }`);
}
bootstrap();
