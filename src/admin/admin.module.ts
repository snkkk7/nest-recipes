import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminStrategy } from './strategies/admin.strategy';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[PrismaModule,AuthModule],
  controllers:[AdminController],
  providers: [AdminService,AdminStrategy]
})
export class AdminModule {}
