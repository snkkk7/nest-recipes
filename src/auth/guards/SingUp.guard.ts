import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UsersService } from 'src/auth/helpers/users.service';


@Injectable()
export class SingUpGuard implements CanActivate {

  constructor(
    private readonly usersService:UsersService
  ){}

 async canActivate(
    ctx: ExecutionContext,
  ) {
    
    const { body }:Request = ctx.switchToHttp().getRequest()

    const user = await this.usersService.findUserByEmail(body.email)
    
    console.log(user)

    if(user){
      throw new BadRequestException("Такой пользоватаель уже существует!")
    }

    return true

  }
}
