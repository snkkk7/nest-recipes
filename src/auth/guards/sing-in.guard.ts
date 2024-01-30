import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PasswordService } from 'src/auth/helpers/password.service';
import { UsersService } from 'src/auth/helpers/users.service';

@Injectable()
export class SingInGuard implements CanActivate {

  constructor(
    private readonly usersService:UsersService,
    private readonly passwordService:PasswordService
  ){}

 async canActivate(
    context: ExecutionContext,
  ){

    const {body} = context.switchToHttp().getRequest()

    const user = await this.usersService.findUserByEmail(body.email)

    if(!user){
      throw new UnauthorizedException("Такого пользователя нет!")
    }

    const hashPassword = this.passwordService.generateHashpasport(body.password,user.salt)

    if(hashPassword !== user.hashPassword){
      throw new UnauthorizedException("Не верный пароль!")
    }

    return true

    
  }
}
