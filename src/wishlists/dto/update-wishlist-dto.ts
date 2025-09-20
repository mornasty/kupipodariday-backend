import { IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateWishlistDto {
  @IsOptional()
  @Length(1, 250)
  name: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  itemsId: number[];

  @Length(1, 1500)
  @IsOptional()
  description: string;
}
