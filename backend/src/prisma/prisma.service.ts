import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    // モジュール初期化時にデータベースに接続
    async onModuleInit () {
        await this.$connect();
        console.log('✅ データベースに接続しました');
    }

    // アプリケーション終了時にデータベース接続を切断
    async onModuleDestroy () {
        await this.$disconnect();
        console.log('❌ データベース接続を切断しました');
    }
}