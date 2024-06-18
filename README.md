Todo API
==========

This API can get, create, update, and delete the task.

## Installation

In order to start using this project, please first run the following command.
```
npm install
```

This project has been developed and tested with Node.js version 20.11.0.

## Utilization

Once the installation process is successful, you can start initializing this API with the following command:
```
npm run start:dev
```

If everything is OK, you should be able to see the following (or this pattern of) messages in the terminal:
```
> todo-api@0.0.1 start
> nest start

[Nest] xxxx  - DD/MM/YYYY, hh:mm:ss PM     LOG [NestFactory] Starting Nest application...
[Nest] xxxx  - DD/MM/YYYY, hh:mm:ss PM     LOG [NestApplication] Nest application successfully started
```

### Request Example
```
{
    "title": "Buy new PC",
    "description": "Go to the shop and buy the researched PC"
}
```

You can find the Postman collection for making requests in ./collection

### Available Routes
[GET] http://localhost:3000 => Get all available tasks.

[GET] http://localhost:3000/{{todo_id}} => Get a task by task's ID.

[POST] http://localhost:3000 => Create new task (requires both title and description fields).

[PUT] http://localhost:3000/{{todo_id}} => Update a task by task's ID (requires either title or description fields).

[DELETE] http://localhost:3000/{{todo_id}} => Delete a task by task's ID.


### Noted
Due to the design of storage, please do not constantly send requests. Please delay the sending for 0.5 - 1 second before sending the next request.
