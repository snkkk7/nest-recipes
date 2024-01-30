import {
      Body,
      Controller,
      Delete,
      Get,
      HttpCode,
      HttpStatus,
      Logger,
      Param,
      ParseIntPipe,
      Patch,
      Post,
      Query,
      Req,
      UploadedFile,
      UseGuards,
      UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { RecipesService } from "./recipes.service";
import { CreateRecipeDto, QueryParamsGetRecipe } from "./dto";
import { JwtAccessTokenAuthGuard } from "src/auth/guards/JwtAccessToken.guard";
import { diskStorage } from "multer";
import { OwnerRecipeGuard } from "./guards/OwnerRecipe.guard";
import { extname } from "path";
import { ApiBody, ApiConsumes, ApiQuery } from "@nestjs/swagger";

@Controller("recipes")
export class RecipesController {
      constructor(private readonly recipesService: RecipesService) {}

      private readonly logger = new Logger(RecipesController.name);

      @Post("/")
      @UseGuards(JwtAccessTokenAuthGuard)
      @ApiConsumes("multipart/form-data")
      @ApiBody({
            schema: {
                  type: "object",
                  properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        typeId: { type: "string" },
                        holidayId: { type: "string" },
                        nationalCuisineId: { type: "string" },
                        steps: {
                              type: "array",
                              items: {
                                    type: "object",
                                    properties: {
                                          name: {
                                                type: "string",
                                          },
                                    },
                              },
                        },

                        ingredients: {
                              type: "array",
                              items: {
                                    type: "object",
                                    properties: {
                                          name: {
                                                type: "string",
                                          },
                                    },
                              },
                        },
                        file: {
                              type: "string",
                              format: "binary",
                        },
                  },
            },
      })
      @UseInterceptors(
            FileInterceptor("file", {
                  storage: diskStorage({
                        destination: "./static",
                        filename: (req, file, callback) => {
                              const uniqueSuffix =
                                    Date.now() +
                                    "-" +
                                    Math.round(Math.random() * 1e9);
                              const ext = extname(file.originalname);

                              const filename = `${uniqueSuffix}${ext}`;
                              callback(null, filename);
                        },
                  }),
            }),
      )
      async postRecipe(
            @UploadedFile() file,
            @Body()
            {
                  steps,
                  ingredients,
                  title,
                  description,
                  holidayId,
                  nationalCuisineId,
                  typeId,
            }: CreateRecipeDto,
            @Req() { user: { id } },
      ) {
            this.logger.log(steps);

            const recipe = await this.recipesService.postRecipe(
                  {
                        steps,
                        ingredients,
                        title,
                        description,
                        filename: file.filename,
                        typeId,
                        holidayId,
                        nationalCuisineId,
                  },
                  id,
            );
            return recipe;
      }

      @Get("/")
      @ApiQuery({ name: "page", example: 1 })
      @ApiQuery({ required: false, name: "nationalCuisineId", example: 1 })
      @ApiQuery({ required: false, name: "typeId", example: 1 })
      @ApiQuery({ required: false, name: "holidayId", example: 1 })
      @ApiQuery({ required: false, name: "search", example: "фалафель" })
      async getRecipes(@Query() queryParams: QueryParamsGetRecipe) {
            return await this.recipesService.findRecipes(queryParams);
      }

      @Get("/:id")
      async getRecipe(@Query("id", ParseIntPipe) id: number) {
            return this.recipesService.findRecipeById(id);
      }

      @HttpCode(HttpStatus.NO_CONTENT)
      @UseGuards(OwnerRecipeGuard)
      @Delete("/:id")
      async deleteRecipe(@Param("id", ParseIntPipe) id: number) {
            await this.recipesService.deleteRecipe(id);
      }

      @UseGuards(OwnerRecipeGuard)
      @Patch("/:id")
      @ApiConsumes("multipart/form-data")
      @ApiBody({
            schema: {
                  type: "object",
                  properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        typeId: { type: "string" },
                        holidayId: { type: "string" },
                        nationalCuisineId: { type: "string" },
                        steps: {
                              type: "array",
                              items: { type: "object" },
                        },

                        ingredients: {
                              type: "array",
                              items: { type: "object" },
                        },
                        file: {
                              type: "string",
                              format: "binary",
                        },
                  },
            },
      })
      async editRecipe(@Param("id", ParseIntPipe) id: number, @Body() body) {
            this.logger.log(body);

            return 1;
      }
}
