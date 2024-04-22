import { Controller, Get } from '@nestjs/common';
import { DbService } from './db.service';

@Controller('db')
export class DbController {
  constructor(private readonly dbService: DbService) {}

  @Get('migrate/schema')
  migrateSchema() {
    return this.dbService.migrateScheme();
  }
}
