/**
 * app.module.ts
 *
 * アプリケーションのルートモジュール
 * アプリケーション全体の依存関係を管理します。
 * 各機能モジュールをインポートし、アプリケーション全体を構成します。
 */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { TodoModule } from './todo/todo.module';

/**
 * AppModule
 *
 * アプリケーションのルートモジュール
 * 以下のコンポーネントを統合します：
 * - Controllers: リクエストのハンドリング
 * - Services: ビジネスロジックの実装
 * - Providers: 依存性の注入
 */
@Module({
  imports: [TodoModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
