import { Injectable } from '@nestjs/common';
import { PasswordService } from 'src/auth/helpers/password.service';
import { PrismaService } from 'src/prisma/prismaService';
import { TokenService } from 'src/auth/helpers/token.service';
import { UsersService } from 'src/auth/helpers/users.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly prismaService:PrismaService,
        private readonly passwordService:PasswordService,
        private readonly usersService:UsersService,
        private readonly tokenService:TokenService
    ){}

    async signUp(email:string,password:string,username:string){

        const salt = this.passwordService.getSalt()

        const hashPassword = this.passwordService.generateHashpasport(password,salt)

        const user = await this.prismaService.user.create({
            data:{
                email,hashPassword,username,salt,role:'USER'
            }
        })

        const tokens = this.tokenService.generateTokens(email)

        const token = await this.tokenService.saveRefreshToken(user.id,tokens.refreshToken)

        return {
            tokens,
            data:{
                email,
            }
        }
    
    }   

    async singIn(email:string){

        const user = await this.usersService.findUserByEmail(email) // need to refactor

        await this.tokenService.removeToken(user.id)

        const tokens = this.tokenService.generateTokens(email)

        await this.tokenService.saveRefreshToken(user.id,tokens.refreshToken)

        return tokens

    }

    async refresh(email:string,id:number){

        await this.tokenService.removeToken(id)

        const tokens = this.tokenService.generateTokens(email)

        await this.tokenService.saveRefreshToken(id,tokens.refreshToken)

        return tokens

    }

    async logout(id:number){

        console.log(id)

        await this.tokenService.removeToken(id)


    }

}
