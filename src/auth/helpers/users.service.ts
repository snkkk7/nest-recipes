import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaService';

@Injectable()
export class UsersService {

    constructor(
        private readonly prismaService:PrismaService
    ){}

    async findUserByEmail(email:string){

        const user = this.prismaService.user.findFirst({where:{email}})
        
        return user
        
    }

}
