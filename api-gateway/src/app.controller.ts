import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ProxyService } from './proxy/service/proxy.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly proxyService: ProxyService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'API status',
    description:
      'Returns a basic status response to confirm that the gateway is online.',
  })
  @ApiResponse({
    status: 200,
    description: 'Gateway is running.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        message: { type: 'string', example: 'hello world' },
      },
    },
  })
  getHello() {
    return {
      status: 'ok',
      message: 'hello world',
    };
  }

  @Get('health')
  @ApiOperation({
    summary: 'Check gateway and dependent services health',
    description:
      'Checks the status of the gateway itself and the upstream microservices to report whether they are available.',
  })
  @ApiResponse({
    status: 200,
    description: 'Health check result returned successfully.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2026-08-29T00:00:00.000Z',
        },
        services: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'healthy' },
              data: { type: 'object', nullable: true },
              error: { type: 'string', nullable: true },
            },
          },
        },
      },
    },
  })
  async getHeath() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        users: await this.proxyService.getServiceHealth('users'),
        products: await this.proxyService.getServiceHealth('products'),
        checkout: await this.proxyService.getServiceHealth('checkout'),
        payments: await this.proxyService.getServiceHealth('payments'),
      },
    };
  }
}
