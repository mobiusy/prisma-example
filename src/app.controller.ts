import { Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Post('user')
  createUser() {
    return this.appService.createUser();
  }

  @Get('user')
  findUser(@Query('id') id: string) {
    return this.appService.findUser(Number(id));
  }
}
