import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
    @ApiProperty({
      description: 'タスクの完了状態',
      example: true,
      required: false,
  })
  @IsOptional()
  @IsBoolean({message: '完了状態は真偽値でなければなりません'})
  completed?: boolean;
}
