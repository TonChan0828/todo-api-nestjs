import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodoController', () => {
  let controller: TodoController;

  const serviceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const user = { sub: 42 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [{ provide: TodoService, useValue: serviceMock }],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    jest.clearAllMocks(); // 各テストの前にモックをリセット
  });

  it('POST /todo: 新しいTodoを作成する', async () => {
    const dto: CreateTodoDto = { title: '本読読む', description: '技術書' };
    serviceMock.create.mockResolvedValue({
      id: 1,
      userId: user.sub,
      ...dto,
      completed: false,
    });

    await expect(controller.create(dto, user as any)).resolves.toMatchObject({
      id: 1,
      userId: user.sub,
    });

    expect(serviceMock.create).toHaveBeenCalledWith(user.sub, dto);
  });

  it('GET /todo: findAll の結果を返す', async () => {
    serviceMock.findAll.mockResolvedValue([{ id: 1 }]);
    await expect(controller.findAll(user as any)).resolves.toHaveLength(1);
    expect(serviceMock.findAll).toHaveBeenCalledWith(user.sub);
  });

  it('GET /todo/:id: findOne を呼んで返す', async () => {
    serviceMock.findOne.mockResolvedValue({ id: 1, userId: user.sub });
    await expect(controller.findOne(1, user as any)).resolves.toMatchObject({
      id: 1,
      userId: user.sub,
    });
    expect(serviceMock.findOne).toHaveBeenCalledWith(user.sub, 1); // ← +id されている前提
  });

  it('PATCH /todo/:id: update を呼んで返す', async () => {
    const dto: UpdateTodoDto = { completed: true };
    serviceMock.update.mockResolvedValue({
      id: 1,
      userId: user.sub,
      completed: true,
      ...dto,
    });

    await expect(controller.update(1, dto, user as any)).resolves.toMatchObject(
      {
        id: 1,
        userId: user.sub,
        completed: true,
      },
    );

    expect(serviceMock.update).toHaveBeenCalledWith(user.sub, 1, dto);
  });

  it('DELETE /todo/:id: remove を呼んで返す', async () => {
    serviceMock.remove.mockResolvedValue({ id: 1, userId: user.sub });

    await controller.remove(1, user as any);
    expect(serviceMock.remove).toHaveBeenCalledWith(user.sub, 1);
  });
});
