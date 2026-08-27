import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggingMiddleware } from './logging/logging.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 6000, // 1 min,
        limit: 100, // 100 request per minute
      },
    ]),
  ],
  providers: [LoggingMiddleware],
})
export class MiddlewareModule {}
