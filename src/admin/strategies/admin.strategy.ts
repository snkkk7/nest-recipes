import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenService } from "src/auth/helpers/token.service";
import { UsersService } from "src/auth/helpers/users.service";





@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy,'admin') {

  private readonly logger = new Logger(AdminStrategy.name)

  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UsersService
    ) {
    super({
        jwtFromRequest: ExtractJwt.fromExtractors([
          (req) => {    
            if(req && req.cookies){
                return req.cookies['refreshToken'];
            }

            return null
          },
        ]),
        ignoreExpiration: false,
        secretOrKey: process.env.REFRESHTOKEN_SECRET,
      });
  }

  

  async validate(payload: any, done: Function) {

    const user = await this.userService.findUserByEmail(payload.email)

    if(user.role !== 'ADMIN'){
        throw new UnauthorizedException('Нет прав!');
    }

    return user 
  }
}