import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { PrismaService } from '../prisma/prisma.service';

// PrismaService の最小モック
function createPrismaMock() {
  return {
    todo: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
}

describe('TodoService', () => {
  let service: TodoService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: PrismaService, useValue: prisma }, // 本物の代わりに注入
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    jest.clearAllMocks();
  });

  it('create: DTO をそのまま Prisma に渡して作成する', async () => {
    const dto = { title: '買い物に行く', description: '牛乳とパン' };
    const now = new Date();
    prisma.todo.create.mockResolvedValue({
      id: 1,
      title: dto.title,
      description: dto.description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });

    await expect(service.create(dto)).resolves.toMatchObject({
      id: 1,
      title: '買い物に行く',
      description: '牛乳とパン',
    });

    expect(prisma.todo.create).toHaveBeenCalledWith({
      data: { title: dto.title, description: dto.description },
    });
  });

  it('findAll: 作成日時の降順で全件取得する', async () => {
    prisma.todo.findMany.mockResolvedValue([]);
    await service.findAll();
    expect(prisma.todo.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
  });

  it('findOne: 見つかった場合は返す', async () => {
    const now = new Date();
    prisma.todo.findUnique.mockResolvedValue({
      id: 1,
      title: 'T',
      description: null,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });

    await expect(service.findOne(1)).resolves.toMatchObject({ id: 1 });
    expect(prisma.todo.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('findOne: 見つからない場合は NotFoundException を投げる', async () => {
    prisma.todo.findUnique.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('update: 指定IDを更新する', async () => {
    const now = new Date();
    const existing = {
      id: 1,
      title: '更新前',
      description: null,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    prisma.todo.findUnique.mockResolvedValue(existing);
    prisma.todo.update.mockResolvedValue({
      ...existing,
      title: '更新後',
      completed: true,
      updatedAt: now,
    });

    await expect(
      service.update(1, { title: '更新後', completed: true }),
    ).resolves.toMatchObject({ id: 1, title: '更新後', completed: true });

    expect(prisma.todo.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { title: '更新後', completed: true },
    });
  });

  it('remove: 指定IDを削除する', async () => {
    const now = new Date();
    const existing = {
      id: 1,
      title: 'T',
      description: null,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    prisma.todo.findUnique.mockResolvedValue(existing);
    prisma.todo.delete.mockResolvedValue(existing);

    await expect(service.remove(1)).resolves.toMatchObject({ id: 1 });
    expect(prisma.todo.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
