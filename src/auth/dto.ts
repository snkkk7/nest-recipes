import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class SingUpDto {
      @IsString()
      @Length(2, 25)
      @ApiProperty({
            example: "username",
      })
      username: string;

      @IsString()
      @IsEmail()
      @ApiProperty({
            example: "email@gmail.com",
      })
      email: string;

      @IsNotEmpty()
      @Length(2, 25)
      @ApiProperty({
            example: "1A2A3A4A5A6A7AAA0",
      })
      password: string;
}

export class SingInDto {
      @IsString()
      @IsEmail()
      @ApiProperty({
            example: "gmail@gmail.com",
      })
      email: string;

      @IsNotEmpty()
      @Length(2, 25)
      @ApiProperty({
            example: "123456778",
      })
      password: string;
}
