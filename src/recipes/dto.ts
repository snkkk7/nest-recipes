import {
      IsNotEmpty,
      IsNumber,
      IsOptional,
      IsString,
      Length,
      ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";

class Characteristic {
      @ApiProperty()
      name: string;
}

export class CreateRecipeDto {
      @IsString()
      @Length(3, 50)
      @ApiProperty({
            example: "test title",
      })
      title: string;

      @IsString()
      @Length(3, 250)
      @ApiProperty({
            example: "test description",
      })
      description: string;

      // @ValidateNested({ each: true })
      // @Type(() => Characteristic)
      @ApiProperty({
            isArray: true,
            example: [{ name: "step 1", id: 1 }],
      })
      steps: Characteristic[];

      // @ValidateNested({ each: true })
      // @Type(() => Characteristic)
      @ApiProperty({
            isArray: true,
            example: [{ name: "step 1", id: 1 }],
      })
      ingredients: Characteristic[];

      @IsNotEmpty()
      @ApiProperty({
            example: 1,
      })
      typeId: number;

      @IsNotEmpty()
      @ApiProperty({
            example: 1,
      })
      holidayId: number;

      @IsNotEmpty()
      @ApiProperty({
            example: 1,
      })
      nationalCuisineId: number;

      @ApiProperty({ type: "string", format: "binary", required: true })
      filename: any;
}

export class CreatePayloadRecipeInfo extends CreateRecipeDto {
      filename: string;
}

export class QueryParamsGetRecipe {
      @IsOptional()
      typeId: number;
      @IsOptional()
      holidayId: number;
      @IsOptional()
      nationalCuisineId: number;
      @IsOptional()
      search: string;
      @IsNotEmpty()
      page: number;
}
