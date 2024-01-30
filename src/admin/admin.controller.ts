import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AdminService } from "./admin.service";
import { AddCharacteristic, CharacteristicQueryParams } from "./dto";



@Controller('admin')
@UseGuards(AuthGuard('admin'))
export class AdminController{
    

    constructor(
        private readonly adminService:AdminService
    ){}

    
    @Post("types")
    async addType(@Body() body : AddCharacteristic){

        const type = await this.adminService.addType(body.name)

        return type
    }

    @Post("nationalCuisines")
    async addNationalCuisine(@Body() body : AddCharacteristic){

        const nationalCuisine = await this.adminService.addNationalCuisine(body.name)

        return nationalCuisine

    }

    @Post("holidays")
    async addHoliday(@Body() body : AddCharacteristic){

        const holiday = await this.adminService.addHoliday(body.name)

        return holiday

    }



    @Put("types/:id")
    async editType(@Body() body : AddCharacteristic,@Param("id",ParseIntPipe) id : number){

        const type = await this.adminService.editType(body.name,id)

        return type

    }

    @Put("holidays/:id")
    async editHoliday(@Body() body : AddCharacteristic,@Param("id",ParseIntPipe) id : number){
        
        const holiday = await this.adminService.editHoliday(body.name,id)

        return holiday

    }

    @Put("nationalCuisines/:id")
    async editNationalCuisine(@Body() body : AddCharacteristic,@Param("id",ParseIntPipe) id : number){
        
        const nationalCuisine = await this.adminService.editNationalCuisine(body.name,id)

        return nationalCuisine

    }


    @Get('types')
    async getTypes(@Query() query : CharacteristicQueryParams){

        const types = await this.adminService.getTypes(Number(query.page),query.search)

        return types

    }
    @Get('holidays')
    async getHolidays(@Query() query : CharacteristicQueryParams){

        const holidays = await this.adminService.getTypes(Number(query.page),query.search)

        return holidays

    }


    @Get('nationalCuisine')
    async getNationalCuisine(@Query() query : CharacteristicQueryParams){

        const nationalCuisines = await this.adminService.getTypes(Number(query.page),query.search)

        return nationalCuisines

    }

    @HttpCode(HttpStatus.OK)
    @Post('/allowRecipe/:id')
    async allowRecipe(@Param('id',ParseIntPipe) id : number){

       const recipe = await this.adminService.allowRecipe(id)

       return recipe

    }

    @HttpCode(HttpStatus.OK)
    @Post('/rejectRecipe/:id')
    async rejectRecipe(@Param('id',ParseIntPipe) id : number){

        const recipe = await this.adminService.allowRecipe(id)

        return recipe

    }


}