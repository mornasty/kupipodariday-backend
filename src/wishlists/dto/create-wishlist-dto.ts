import { IsArray, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  @IsString()
  name: string;

  @IsUrl()
  image: string;
  

  @IsArray()
  itemsId: number[];

  @Length(1, 1500)
  @IsString()
  description: string;
}
