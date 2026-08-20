import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @IsNotEmpty() name!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(7) phone!: string;
  @IsString() @MinLength(8) password!: string;
}

export class LoginDto {
  @IsString() @IsNotEmpty() emailOrPhone!: string;
  @IsString() @MinLength(8) password!: string;
}
