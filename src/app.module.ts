import { Global, Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";

import { RecipesModule } from "./recipes/recipes.module";
import { PrismaService } from "./prisma/prismaService";
import { TokenService } from "./auth/helpers/token.service";
import { JwtModule } from "@nestjs/jwt";
import { PasswordService } from "./auth/helpers/password.service";
import { PrismaModule } from "./prisma/prisma.module";
import { AdminModule } from "./admin/admin.module";

@Global()
@Module({
  imports: [
    AuthModule,
    RecipesModule,
    JwtModule.register({
      global: true,
    }),
    PrismaModule,
    AdminModule,
  ],
  controllers: [],
  providers: [TokenService, PasswordService],
  exports: [],
})
export class AppModule {}
