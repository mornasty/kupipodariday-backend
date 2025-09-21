import { IsNumber, IsOptional, IsString, IsUrl, Length, Min } from 'class-validator';

export class UpdateWishDto {
  @Length(1, 250)
  @IsString()
  @IsOptional()
  name: string;

  @IsUrl()
  @IsOptional()
  link: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(1)
  price: number;

  @Length(1, 1024)
  @IsOptional()
  @IsString()
  description: string;
}
