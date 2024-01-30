import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from 'src/auth/auth.module';



@Module({
  imports:[PrismaModule,ServeStaticModule.forRoot({
    rootPath:join(__dirname,'..','static')
  }),AuthModule],
  controllers: [RecipesController],
  providers: [RecipesService]
})
export class RecipesModule  {
    // configure(consumer: MiddlewareConsumer) {
    //   consumer.apply(MulterMiddleware).forRoutes('recipes')
    // }
}
