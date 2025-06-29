import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['query'],
    });
  }

  async onModuleInit() {
    const prisma = this;
    Object.assign(
      this,
      this.$extends({
        query: {
          user: {
            async findMany({ args, query }) {
              args.where = { ...args.where, deletedAt: null };

              return query(args);
            },

            async findFirst({ args, query }) {
              args.where = { ...args.where, deletedAt: null };

              return query(args);
            },

            async findUnique({ args, query }) {
              args.where = { ...args.where, deletedAt: null };

              return query(args);
            },
            delete() {
              throw new Error('not implemented');
            },
          },
          article: {
            async findMany({ args, query }) {
              args.where = { ...args.where, deletedAt: null };

              return query(args);
            },

            async findFirst({ args, query }) {
              args.where = { ...args.where, deletedAt: null };

              return query(args);
            },

            async findUnique({ args, query }) {
              args.where = { ...args.where, deletedAt: null };

              return query(args);
            },

            delete() {
              throw new Error('not implemented');
            },
          },
        },
      }),
    );
    await this.$connect();
  }
}
