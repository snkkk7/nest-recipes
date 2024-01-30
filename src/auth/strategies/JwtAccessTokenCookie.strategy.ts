import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenService } from '../helpers/token.service';
import { Request } from 'express';
import { UsersService } from '../helpers/users.service';


@Injectable()
export class JwtAccessTokenCookieStrategy extends PassportStrategy(Strategy,'jwt-accessToken') {

  private readonly logger = new Logger(JwtAccessTokenCookieStrategy.name)

  constructor(
                private readonly tokenService: TokenService,
                private readonly usersService: UsersService,
            ) {
    super({
        jwtFromRequest: ExtractJwt.fromExtractors([
          (req) => {    
            if(req && req.cookies){
                return req.cookies['accessToken'];
            }

            return null
          },
        ]),
        ignoreExpiration: false,
        secretOrKey: process.env.ACCESSTOKEN_SECRET,
      });
  }

  async validate(payload: any, done: Function) {
    
    const email = payload.email

    const user = await this.usersService.findUserByEmail(email)

    return user 
  }
}