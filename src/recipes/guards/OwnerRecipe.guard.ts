import {
      BadRequestException,
      CanActivate,
      ExecutionContext,
      Injectable,
      UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { PasswordService } from "src/auth/helpers/password.service";
import { TokenService } from "src/auth/helpers/token.service";
import { UsersService } from "src/auth/helpers/users.service";
import { RecipesService } from "../recipes.service";

@Injectable()
export class OwnerRecipeGuard implements CanActivate {
      constructor(
            private readonly usersService: UsersService,
            private readonly passwordService: PasswordService,
            private readonly tokenService: TokenService,
            private readonly recipeService: RecipesService,
      ) {}

      async canActivate(context: ExecutionContext) {
            const req = context.switchToHttp().getRequest();

            const accessToken = req.cookies["accessToken"];

            const isValid = this.tokenService.verifyAccessToken(accessToken);

            if (!isValid) {
                  throw new UnauthorizedException("нет доступа");
            }

            const recipeId = Number(req.params.id);

            const payload = await this.tokenService.decodeToken(accessToken);

            const recipe = await this.recipeService.findRecipeById(recipeId);

            if (!recipe) {
                  throw new BadRequestException("Такого рецепта нет!");
            }

            const user = await this.usersService.findUserByEmail(payload.email);

            if (!user) {
                  throw new BadRequestException("Такого пользователя нет!");
            }

            if (user.id !== recipe.authorInfo.authorId) {
                  throw new UnauthorizedException("нет прав!");
            }

            return true;
      }
}
