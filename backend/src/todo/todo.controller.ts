import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode HttpStatus, ParseIntPipe } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Todo')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // 新しいTodoを作成
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new Todo' })
  @ApiResponse({ status: 201, description: 'Todo created successfully' })
  @ApiResponse({ status: 400, description: 'リクエストデータが不正です' })
  async create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  // Todoの一覧を取得
  @Get()
  @ApiOperation({ summary: 'Get all Todos' })
  @ApiResponse({ status: 200, description: 'List of Todos retrieved successfully' })
  async findAll() {
    return this.todoService.findAll();
  }

  // IDでTodoを取得
  @Get(':id')
  @ApiOperation({ summary: 'Get a Todo by ID' })
  @ApiParam({ name: 'id', description: 'Todo ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Todo retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.todoService.findOne(id);
  }

  // Todoを更新
  @Patch(':id')
  @ApiOperation({ summary: 'Update a Todo By ID' })
  @ApiParam({ name: 'id', description: 'Todo ID', type: 'number'})
  @ApiResponse({ status: 200, description: 'Todo updated successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(id, updateTodoDto);
  }

  // Todoを削除
  @ApiOperation({ summary: 'Delete a Todo by ID' })
  @ApiParam({ name: 'id', description: 'Todo ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Todo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found'})
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.remove(id);
  }
}
