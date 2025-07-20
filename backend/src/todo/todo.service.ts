import { Injectable,NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from '..prisma/prisma.service';
import {Todo} from '@prisma/client';

@Injectable()
export class TodoService {
  // PrismaServiceを依存注入
  constructor(private prisma: PrismaService) {}

  // 新しいTodoを作成するメソッド
  async create (createTodoDto: CreateTodoDto): Promise<Todo> {
    try {
      const todo = await this.prisma.todo.create({
        data: {
          title: createTodoDto.title,
          description: createTodoDto.description,
        },
      });

      console.log(`Todo Created: ID=@{todo.id}, Title=${todo.title}`);
      return todo;
    } catch (error) {
      console.error('Todo Created Error:', error);
      throw new Error('Failed to create todo');
    }
  }

  // Todoの一覧を取得するメソッド
  async findAll (): Promise<Todo[]> {
    try {
      const todos = await this.prisma.todo.findMany({
        orderBy: { createdAt: 'desc' },
      });

      console.log(`Completed findAll Todos = ${todos.length}`);
      return todos;
    } catch (error) {
      console.error('Todo FindAll Error:', error);
      throw new Error('Failed to retrieve todos');
    }
  }
  // IDでTodoを取得するメソッド
  async findOne (id: number: ): Promise<Todo> {
    try {
      const todo = await this.prisma.todo.findUnique({
        where: { id },
      });

      if (!todo) {
        throw new NotFoundException(`Todo with ID ${id} not found`);
      }

      console.log(`Completed FindOne todo ID = ${id}`);
      return todo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Todo FindOne Error:', error);
      throw new Error(`Failed to retrieve todo with ID ${id}`);
    }
  }

  // Todoを更新するメソッド
  async update(id: number, updateTodoDto: UpdateTodoDto):Promise<Todo> {
    try {
      await this.findOne(id);

      const todo = await this.prisma.todo.update({
        where: id{ id },
        data: {updateTodoDto},
      });
    
    console.log(`Todo Updated ID = ${id}, Title = ${todo.title}`);
    return todo;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    console.error('Todo Update Error:', error);
    throw new Error('Todo update failded');
    }
  }

  // Todoを削除するメソッド
  async remove(id: number): Promise < Todo > {
    try{
      await this.findOne(id);
      const todo = await this.prisma.todo.delete({
        where: { id },
      });

      console.log(`Todo Deleted ID = ${id}, Title = ${todo.title}`);
      return todo;
    }catch (error) {
      if (error instanceof NotFoundException) {
        thorw error;
      }
      console.error('Todo Delete Error:', error);
      throw new Error('Todo delete failed')
    }
  }
}
