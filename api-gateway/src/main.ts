import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from 'node_modules/@nestjs/swagger/dist/swagger-module';
import { DocumentBuilder } from '@nestjs/swagger';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline"],
          imgSrc: ["'self'", 'data', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 3153500,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['*'];

      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('not allowed by CORS'));
    },
    methods: 'GET,PUT,PATCH,POST,DELETE',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
    ],
    credentials: true,
    maxAge: 86400, // 24 hours
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription(
      `## Marketplace API Gateway
Central API Gateway responsible for routing and managing requests
across the Marketplace microservices ecosystem.

### Available Services

- **User Service** — Authentication and user management
- **Products Service** — Product catalog and management
- **Checkout Service** — Cart and order processing
- **Payments Service** — Payment processing

### Authentication

Protected endpoints require authentication using one of the following mechanisms:

- **JWT Bearer Token** — Used to authenticate API requests
- **Session Token** — Used for session validation

Use the **Authorize** button to provide your JWT Bearer token when accessing protected endpoints.`,
    )
    .setVersion('1.0')
    .setContact(
      'Marketplace Team',
      'https://marketplace.com',
      'dev@marketplace.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger is running on: http://localhost:${port}/api`);
};

void bootstrap();
