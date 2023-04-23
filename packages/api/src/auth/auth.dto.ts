import { IsEmail, IsStrongPassword } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 10,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
