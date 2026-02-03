import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  getRoot() {
    return {
      name: 'Dental College API',
      version: '1.0',
      status: 'running',
      docs: '/docs',
      api: '/api/v1',
    };
  }

  @Get('health')
  async getHealth() {
    const dbOk = await this.checkDatabase();
    return {
      status: dbOk ? 'ok' : 'error',
      database: dbOk ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      const result = await this.dataSource.query('SELECT 1 as ok');
      return Array.isArray(result) && result.length > 0 && (result[0]?.ok === 1 || result[0]?.ok === '1');
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}
