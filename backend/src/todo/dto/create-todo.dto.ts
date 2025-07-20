import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import {
    ApiProperty
} from '@nestjs/swagger';

export class CreateTodoDto {
    @ApiProperty({
        description: 'タスクのタイトル',
        maxLength: 100,
        example: '買い物に行く'
    })
    @IsString({message: 'タイトルは文字列でなければなりません'})
    @IsNotEmpty({message: 'タイトルは必須です'})
    @MaxLength(100,{message: 'タイトルは100文字以下でなければなりません'})
    title: string;

    @ApiProperty({ description: 'タスクの説明', maxLength: 500, required: false,example: '牛乳とパンを買う' })
    @IsString({message: '説明は文字列でなければなりません'})
    @IsOptional()
    @MaxLength(500,message: '説明は500文字以下でなければなりません'})
    description?: string;
}
