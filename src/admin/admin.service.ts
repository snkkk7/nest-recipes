import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prismaService';



@Injectable()
export class AdminService {

    private pageSize = 5

    constructor(
        private readonly prismaService : PrismaService
    ){}

    async getTypes(page:number,searchName:string){

        const offset = (page - 1) * this.pageSize;

        const types = await this.prismaService.type.findMany({
            where:{
                name:{
                    contains:searchName
                }
            },
            take:this.pageSize,
            skip:offset
        })

        return types

    }

    async getHolidays(page:number,searchName:string){
        
        const offset = (page - 1) * this.pageSize;

        const holidays = await this.prismaService.holiday.findMany({
            where:{
                name:{
                    contains:searchName
                }
            },
            take:this.pageSize,
            skip:offset
        })

        return holidays

    }


    async getNationalCuisines(page:number,searchName:string){
        
        const offset = (page - 1) * this.pageSize;

        const nationalCuisines = await this.prismaService.nationalCuisine.findMany({
            where:{
                name:{
                    contains:searchName
                }
            },
            take:this.pageSize,
            skip:offset
        })

        return nationalCuisines

    }



    async addType(typeName : string){

        return this.prismaService.type.create({
            data:{
                name:typeName
            }
        })

    }

    async addHoliday(holidayName : string){
       
        return this.prismaService.holiday.create({
            data:{
                name:holidayName
            }
        })

    }

    async addNationalCuisine(nationalCuisineName : string){
       
        return this.prismaService.nationalCuisine.create({
            data:{
                name:nationalCuisineName
            }
        })

    }

    async editType(typeName:string,id:number){

        return this.prismaService.type.update({
            data:{
                name:typeName
            },
            where:{
                id
            }
        })

    }

    async editNationalCuisine(nationalCuisineName:string,id:number){

        return this.prismaService.nationalCuisine.update({
            data:{
                name:nationalCuisineName
            },
            where:{
                id
            }
        })

    }

    async editHoliday(holidayName:string,id:number){

        return this.prismaService.holiday.update({
            data:{
                name:holidayName
            },
            where:{
                id
            }
        })

    }

    async allowRecipe(id:number){

        return this.prismaService.recipe.update({
            where:{id},
            data:{
                isReject:false,
                isChecked:true
            }
        })

    }


    async rejectRecipe(id:number){

        return this.prismaService.recipe.update({
            where:{id},
            data:{
                isReject:true,
                isChecked:false
            }
        })

    }

}
