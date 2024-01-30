import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    this.logger.warn("Коннект!")
    await this.$connect();
  }
}