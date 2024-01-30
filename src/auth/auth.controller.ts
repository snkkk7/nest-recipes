import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingInDto, SingUpDto } from './dto';
import { SingUpGuard } from './guards/SingUp.guard';
import { Response } from 'express';
import { SingInGuard } from './guards/sing-in.guard';
import { JwtRefreshTokenCookieStrategy } from './strategies/JwtRefreshTokenCookie.strategy';
import { AuthGuard } from '@nestjs/passport';
import { JwtRefreshTokenAuthGuard } from './guards/jwtRefreshToken.guard';


@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService:AuthService
    ){}

    @UseGuards(SingUpGuard)
    @Post("signup")
    async singUp(@Body() {email,password,username}: SingUpDto,@Res({passthrough:true}) res: Response){

        const userInfo = await this.authService.signUp(email,password,username)

        res.cookie('refreshToken',userInfo.tokens.refreshToken,{httpOnly:true,maxAge: 24 * 60 * 60 * 1000})

        res.cookie('accessToken',userInfo.tokens.accessToken,{httpOnly:true,maxAge: 24 * 60 * 60 * 1000})

        return {
            email:userInfo.data.email,
           
        }


    }

    @UseGuards(SingInGuard)
    @Post("signin")
    @HttpCode(HttpStatus.OK)
    async singIn(@Body() {password,email}: SingInDto,@Res({passthrough:true}) res: Response){

        const {accessToken,refreshToken} = await this.authService.singIn(email)

        res.cookie('refreshToken',refreshToken,{httpOnly:true,maxAge: 24 * 60 * 60 * 1000})

        res.cookie('accessToken',accessToken,{httpOnly:true,maxAge: 24 * 60 * 60 * 1000})

        return {
            email:email,
        }
    }

     
    @Get("refresh")
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtRefreshTokenAuthGuard)
    async refresh(@Res({passthrough:true}) res: Response,@Req() req){

        console.log(req.user)

        const tokens = await this.authService.refresh(req.user.email,req.user.id)

        res.cookie('refreshToken',tokens.refreshToken,{httpOnly:true,maxAge: 24 * 60 * 60 * 1000})

        res.cookie('accessToken',tokens.accessToken,{httpOnly:true,maxAge: 24 * 60 * 60 * 1000})
        
    }

    @Post("logout")
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(JwtRefreshTokenAuthGuard)
    async logout(@Req() req,@Res() res : Response){

        console.log(req.user.id)

         await this.authService.logout(req.user.id)

         res.clearCookie('acccessToken')
         res.clearCookie('refreshToken')

         res.send()
        
    }

}
