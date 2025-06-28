import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['query', 'error'],
    });
  }

  async onModuleInit() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
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

            async delete({ args }) {
              return prisma.user.update({
                where: args.where,
                data: { deletedAt: new Date() },
              });
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

            async delete({ args }) {
              return prisma.article.update({
                where: args.where,
                data: { deletedAt: new Date() },
              });
            },
          },
        },
      }),
    );
    await this.$connect();
  }
}
