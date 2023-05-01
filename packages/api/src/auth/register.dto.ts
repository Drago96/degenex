import { IsNumberString, Length } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @IsNumberString()
  @Length(6, 6)
  verificationCode: string;
}
