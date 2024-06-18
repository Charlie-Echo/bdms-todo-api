import { Controller, Param, Body, Get, Post, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { AppService, Response, CreateRequest, UpdateRequest } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getTodoList(): Response {
    return this.appService.getTodoList();
  }

  @Get(':id')
  getTodoListByID(@Param('id') id: string): Response {
    return this.appService.getTodoByID(id);
  }

  @Post()
  createNewTodo(@Body() params: unknown): Response {
    this.appService.validateBody(params, 'create');
    return this.appService.createNewTodo(params as CreateRequest);
  }

  @Put(':id')
  updateTodoByID(@Param('id') id: string, @Body() params: unknown): Response {
    this.appService.validateBody(params, 'update');
    return this.appService.updateTodoByID(id, params as UpdateRequest);
  }

  @Delete(':id')
  deleteTodoByID(@Param('id') id: string): Response {
    return this.appService.deleteTodoByID(id);
  }
}
