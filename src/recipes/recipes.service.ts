import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma/prismaService";
import {
      CreatePayloadRecipeInfo,
      CreateRecipeDto,
      QueryParamsGetRecipe,
} from "./dto";

@Injectable()
export class RecipesService {
      private logger = new Logger(RecipesService.name);

      constructor(private readonly prismaService: PrismaService) {}

      async postRecipe(paylaod: CreatePayloadRecipeInfo, userId: number) {
            const recipeInfo = await this.prismaService.recipe.create({
                  data: {
                        title: paylaod.title,
                        description: paylaod.description,
                        authorId: userId,
                        img: paylaod.filename,
                        typeId: Number(paylaod.typeId),
                        holidayId: Number(paylaod.holidayId),
                        nationalCuisineId: Number(paylaod.nationalCuisineId),
                  },
            });

            const ingredientsInfo = paylaod.ingredients.map((el, idx) => ({
                  name: el.name,
                  recipeId: recipeInfo.id,
            }));

            const ingredients = await this.prismaService.ingredient.createMany({
                  data: [...ingredientsInfo],
            });

            const stepsInfo = paylaod.steps.map((el, idx) => ({
                  name: el.name,
                  recipeId: recipeInfo.id,
            }));

            const steps = await this.prismaService.step.createMany({
                  data: [...stepsInfo],
            });

            return recipeInfo;
      }

      async findRecipeById(id: number) {
            const recipe = await this.prismaService.recipe.findFirst({
                  where: {
                        id,
                  },
            });

            const ingredients = await this.prismaService.ingredient.findMany({
                  where: {
                        recipeId: id,
                  },
            });

            const steps = await this.prismaService.step.findMany({
                  where: {
                        recipeId: id,
                  },
            });

            const type = await this.prismaService.type.findFirst({
                  where: {
                        id: recipe.typeId,
                  },
            });

            const holiday = await this.prismaService.holiday.findFirst({
                  where: {
                        id: recipe.holidayId,
                  },
            });

            const nationalCuisine =
                  await this.prismaService.nationalCuisine.findFirst({
                        where: {
                              id: recipe.nationalCuisineId,
                        },
                  });

            const author = await this.prismaService.user.findFirst({
                  where: {
                        id: recipe.authorId,
                  },
            });

            return {
                  title: recipe.title,
                  description: recipe.description,
                  authorInfo: {
                        authorId: recipe.authorId,
                        authorName: author.username,
                  },
                  ingredients,
                  steps,
                  characteristics: {
                        type,
                        holiday,
                        nationalCuisine,
                  },
            };
      }

      async findRecipes(queryParams: QueryParamsGetRecipe) {
            const whereOptions: any = {
                  page: queryParams.page | 1,
            };

            if (queryParams.holidayId) {
                  whereOptions.holidayId = queryParams.holidayId;
            }

            if (queryParams.typeId) {
                  whereOptions.typeId = queryParams.typeId;
            }

            if (queryParams.holidayId) {
                  whereOptions.holidayId = queryParams.holidayId;
            }

            if (queryParams.search) {
                  whereOptions.search = queryParams.search;
            }

            const recipes = await this.prismaService.recipe.findMany({
                  where: whereOptions,
            });

            return recipes;
      }

      async deleteRecipe(id: number) {
            await this.prismaService.recipe.delete({
                  where: {
                        id,
                  },
            });
      }

      async editRecipe(id: number, body: CreateRecipeDto) {
            this.logger.log(body);

            const stepsInfo = body.steps.map((el, idx) => ({
                  name: el.name,
            }));

            const ingredientsInfo = body.ingredients.map((el, idx) => ({
                  name: el.name,
            }));

            await this.prismaService.ingredient.updateMany({
                  where: {
                        recipeId: id,
                  },
                  data: ingredientsInfo,
            });

            await this.prismaService.step.updateMany({
                  where: {
                        recipeId: id,
                  },
                  data: stepsInfo,
            });

            return await this.prismaService.recipe.update({
                  where: {
                        id,
                  },
                  data: {
                        title: body.title,
                        description: body.description,
                        typeId: body.typeId,
                        holidayId: body.holidayId,
                        nationalCuisineId: body.holidayId,
                  },
            });
      }
}
