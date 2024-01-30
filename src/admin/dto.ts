import { IsNotEmpty, IsString, Length } from "class-validator";



export class AddCharacteristic {
    @IsString()
    @IsNotEmpty()
    @Length(3,20)
    name:string
}

export class CharacteristicQueryParams {
    page:number
    search:string
}