import { IsEmail, IsOptional, IsString, IsUrl, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @Length(2, 30)
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  about: string;
}
