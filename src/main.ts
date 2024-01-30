import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
      const app = await NestFactory.create(AppModule);
      app.use(cookieParser());
      app.useGlobalPipes(new ValidationPipe());

      const config = new DocumentBuilder()
            .setTitle("recipe doc")
            .setDescription("The recipe API description")
            .setVersion("1.0")
            .addTag("recipes")
            .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup("api", app, document);

      await app.listen(3000);
}
bootstrap();
