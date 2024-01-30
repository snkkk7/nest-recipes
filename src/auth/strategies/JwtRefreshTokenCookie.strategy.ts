import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenService } from '../helpers/token.service';
import { Request } from 'express';
import { UsersService } from '../helpers/users.service';


@Injectable()
export class JwtRefreshTokenCookieStrategy extends PassportStrategy(Strategy,'jwt-refreshToken') {

  private readonly logger = new Logger(JwtRefreshTokenCookieStrategy.name)

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

    this.logger.log(payload)

    return user 
  }
}