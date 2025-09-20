import { IsEmail, IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Length(2, 30)
  username: string;

  @IsOptional()
  @IsEmail()
  email: string;

  password: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsOptional()
  @Length(2, 200)
  about: string;
}
