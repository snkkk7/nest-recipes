import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from 'src/auth/helpers/password.service';
import { TokenService } from 'src/auth/helpers/token.service';
import { UsersService } from 'src/auth/helpers/users.service';
import { JwtRefreshTokenCookieStrategy } from './strategies/JwtRefreshTokenCookie.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAccessTokenCookieStrategy } from './strategies/JwtAccessTokenCookie.strategy';



@Module({
  imports:[PrismaModule],
  controllers: [AuthController],
  providers: [AuthService,PasswordService,TokenService,UsersService,JwtRefreshTokenCookieStrategy,JwtAccessTokenCookieStrategy],
  exports:[TokenService,UsersService,PasswordService]
})
export class AuthModule {}
