import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prismaService';


@Injectable()
export class TokenService {

        constructor(
            private readonly jwtService:JwtService,
            private readonly prismaService:PrismaService
        ){}

        generateTokens(email:string){

            const accessToken = this.jwtService.sign({email},{secret:process.env.ACCESSTOKEN_SECRET,expiresIn:"1d"})

            const refreshToken = this.jwtService.sign({email},{secret:process.env.REFRESHTOKEN_SECRET,expiresIn:"7d"})

            return {
                accessToken,
                refreshToken
            }

        }

        verifyAccessToken(accessToken:string){

            const isValid = this.jwtService.verify(accessToken,{secret:process.env.ACCESSTOKEN_SECRET})
            
            return isValid

        }

        verifyRefreshToken(refreshToken:string){

            const isValid = this.jwtService.verify(refreshToken,{secret:process.env.REFRESHTOKEN_SECRET})
            
            return isValid

        }

        async saveRefreshToken(userId:number,token:string){

            const refreshToken = await this.prismaService.refreshToken.create({
                data:{
                    userId,
                    token
                }
            })

            return token
        }

        async removeToken(userId:number){

            console.log(userId)

            const token = await this.prismaService.refreshToken.delete({
                where:{userId}
            })

            return token

        }

        async decodeToken(token:string){

            return this.jwtService.decode(token)
        }


}
