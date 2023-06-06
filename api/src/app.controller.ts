import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getProperties() {
    return await this.appService.getProperties();
  }

  @Get('view/:id')
  async getPropertyById(@Param('id') id: string) {
    return await this.appService.getPropertyById(id);
  }
}
