import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as list from '../storage/data.json';
const storageRoute = './storage/data.json';

type TodoRecord = {
  id: string,
  title: string,
  description: string,
  createdAt: number,
  updatedAt: number
}

export type CreateRequest = {
  title: string,
  description: string
}

export type UpdateRequest = {
  title?: string,
  description?: string
}

export type Response = {
  statusCode: number,
  message: string,
  data?: any
}

@Injectable()
export class AppService {
  validateBody(body: unknown, useCase: 'create' | 'update') {
    if (typeof body !== 'object' || Array.isArray(body) || body === null) {
      throw new HttpException('Invalid body form', HttpStatus.BAD_REQUEST);
    }

    const isContainTitle = 'title' in body;
    const isContainDescription = 'description' in body;
    switch (useCase) {
      case 'create':
        if (!isContainTitle) throw new HttpException('The title field is required', HttpStatus.BAD_REQUEST);
        if (typeof body.title !== 'string') throw new HttpException('The title value is invalid', HttpStatus.BAD_REQUEST);
        if (body.title.length <= 0) throw new HttpException('The title value cannot be empty', HttpStatus.BAD_REQUEST);

        if (!isContainDescription) throw new HttpException('The description field is required', HttpStatus.BAD_REQUEST);
        if (typeof body.description !== 'string') throw new HttpException('The description value is invalid', HttpStatus.BAD_REQUEST);
        if (body.description.length <= 0) throw new HttpException('The description value cannot be empty', HttpStatus.BAD_REQUEST);

        break
      case 'update':
        if (!isContainTitle && !isContainDescription) throw new HttpException('The title or description field is required', HttpStatus.BAD_REQUEST);

        if (isContainTitle) {
          if (typeof body.title !== 'string') throw new HttpException('The title value is invalid', HttpStatus.BAD_REQUEST);
          if (body.title.length <= 0) throw new HttpException('The title value cannot be empty', HttpStatus.BAD_REQUEST);
        }

        if (isContainDescription) {
          if (typeof body.description !== 'string') throw new HttpException('The description value is invalid', HttpStatus.BAD_REQUEST);
          if (body.description.length <= 0) throw new HttpException('The description value cannot be empty', HttpStatus.BAD_REQUEST);
        };

        break;
    }
  }

  getTodoList(): Response {
    return this.wrapResponse(200, 'OK', list);
  }

  getTodoByID(id: string): Response {
    const result = list.find(eachData => id === eachData.id);
    if (!result) throw new HttpException('Record not found', HttpStatus.BAD_REQUEST);

    return this.wrapResponse(200, 'OK', result);
  }

  createNewTodo(data: CreateRequest): Response {
    const time = Date.now();
    const newData: TodoRecord = {
      id: uuid.v4(),
      ...data,
      createdAt: time,
      updatedAt: time
    };

    this.writeJSONFile(list.concat(newData));

    return this.wrapResponse(201, 'Created', newData);
  }

  updateTodoByID(id: string, data: UpdateRequest): Response {
    const index = list.findIndex(eachData => id === eachData.id);
    if (index === -1) throw new HttpException('Record not found', HttpStatus.BAD_REQUEST);

    let dataForInsert: TodoRecord[] = list;
    let newData: TodoRecord = {
      ...list[index],
      title: data.title ? data.title : list[index].title,
      description: data.description ? data.description : list[index].description,
      updatedAt: Date.now()
    };

    dataForInsert[index] = newData;

    this.writeJSONFile(dataForInsert);

    return this.wrapResponse(200, 'OK', newData);
  }

  deleteTodoByID(id: string): Response {
    const dataForInsert = list.filter(eachData => eachData.id !== id);
    if (list.length <= dataForInsert.length) throw new HttpException('Record not found', HttpStatus.BAD_REQUEST);

    this.writeJSONFile(dataForInsert);

    return this.wrapResponse(200, 'OK', id);
  }

  writeJSONFile(data: TodoRecord[]) {
    fs.writeFile(storageRoute, JSON.stringify(data), error => {
      if (error) {
        console.error(error);
        throw new HttpException('Error occurs when saving data, please try again', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  }

  wrapResponse(statusCode: number, message: string, data?: any): Response {
    return {
      statusCode: statusCode,
      message: message,
      data: data ? data : undefined
    };
  }
}
