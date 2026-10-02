import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterOrganizerDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  organizationName: string;

  @IsString()
  description: string;
}